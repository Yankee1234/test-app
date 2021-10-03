import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { BuyProductDto, CreateProductDto, UpdateProductDto } from 'src/core/dto/product.dto';
import Product from 'src/core/entities/product.entity';
import { JwtAdminGuard } from 'src/core/guards/jwt-admin.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
    constructor(
        private readonly shopService: ShopService,
    ) {}

    @Get('list')
    async getProductList(@Req() req: any, @Res() resp: any): Promise<Response> {
        try {
            return resp.status(HttpStatus.OK).json({products: await this.shopService.getProductList()})
        } catch(err) {
            throw err;
        }
    }

    @Post('add')
    @UseGuards(JwtAdminGuard)
    async addProduct(@Req() req: any, @Body() body: CreateProductDto, @Res() resp: any): Promise<Response> {
        try {
            await this.shopService.addProduct(body);
            
            return resp.status(HttpStatus.OK).json({products: await this.shopService.getProductList()});
        } catch(err) {
            throw err;
        }
    }

    @Patch('update')
    @UseGuards(JwtAdminGuard)
    async updateProduct(@Req() req: any, @Body() body: UpdateProductDto, @Res() resp: any): Promise<Response> {
        try {
            await this.shopService.updateProduct(body);

            return resp.status(HttpStatus.OK).json({products: await this.shopService.getProductList()});
        } catch(err) {
            throw err;
        }
    }

    @Delete(':id')
    @UseGuards(JwtAdminGuard)
    async deleteProduct(@Req() req: any, @Param() id: number, @Res() resp: any): Promise<Response> {
        try {
            await this.shopService.deleteProduct(id);

            return resp.status(HttpStatus.OK).json({products: await this.shopService.getProductList()})
        } catch(err) {
            throw err;
        }
    }

    @Post('buy')
    @UseGuards(JwtAuthGuard)
    async buyProduct(@Req() req: any, @Body() body: BuyProductDto, @Res() resp: any): Promise<Response> {
        try {
            return resp.status(HttpStatus.OK).json({result: await this.shopService.buyProduct(body, req)});
        } catch(err) {
            throw err;
        }
    }
}
