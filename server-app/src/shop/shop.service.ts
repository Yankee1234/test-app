import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AUTH_HEADER } from 'src/core/constants/headers.const';
import { BuyProductDto, CreateProductDto, UpdateProductDto } from 'src/core/dto/product.dto';
import Product from 'src/core/entities/product.entity';
import User from 'src/core/entities/user.entity';
import { DbHelper } from 'src/core/helpers/db.helper';
import { StripeService } from 'src/core/services/stripe.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {
    constructor(
        private readonly dbHelper: DbHelper,
        private readonly stripeService: StripeService,
        private readonly userService: UserService,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        @InjectRepository(User) private readonly usersRepository: Repository<User>
    ) {}

    async getProductList() {
        try {
            return await this.dbHelper.getAll(this.productRepository, {});
        } catch(err) {
            throw err;
        }
    }

    async addProduct(data: CreateProductDto) {
        try {
            await this.dbHelper.set(this.productRepository, {
                name: data.name,
                price: data.price
            })
        } catch(err) {
            throw err;
        }
    }

    async updateProduct(data: UpdateProductDto) {
        try {
            const options = {columnName: 'id', 
            setOptions: {name: data.name, price: data.price},
            whereOptions: {id: data.id},
            }
            await this.dbHelper.update(Product, options);
        } catch(err) {
            throw err; 
        }
    }

    async deleteProduct(id: number) {
        try {
            await this.dbHelper.delete(this.productRepository, {id: id});
        } catch(err) {
            throw err;
        }
    }

    async buyProduct(data: BuyProductDto, req: any): Promise<any> {
        try {
            const payload = await this.userService.verify(req.headers[AUTH_HEADER].replace('Bearer ', ''));
            const user = await this.dbHelper.get(this.usersRepository, {where: {id: payload.userId}});
            const product = await this.dbHelper.get(this.productRepository, {where: {id: data.id}});
            
            const paymentIntent = await this.stripeService.createPaymentIntent(
                {customerId: user.customerId, price: product.price});

            return paymentIntent;
        } catch(err) {
            throw err;
        }
    }
}
