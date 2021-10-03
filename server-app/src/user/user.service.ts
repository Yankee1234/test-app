import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtVerifier } from 'src/core/classes/JwtVerifier.class';
import { UserLoginDto, UserRegisterDto } from 'src/core/dto/user.dto';
import User from 'src/core/entities/user.entity';
import { Roles } from 'src/core/enums/role.enum';
import { DbHelper } from 'src/core/helpers/db.helper';
import { StripeService } from 'src/core/services/stripe.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly stripeService: StripeService,
        private readonly dbHelper: DbHelper,
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
    ) {}

    async getUserById(id: number): Promise<User> {
        try {
            return await this.dbHelper.get(this.usersRepository, {where: {id: id}});
        } catch(err) {
            throw err;
        }
    }

    async login(data: UserLoginDto): Promise<any> {
        let user = null;
        try {
            user = await this.dbHelper.get(this.usersRepository, {
                where: {
                    login: data.login,
                    password: data.password
                }
            });
        } catch(err) {
            throw new UnauthorizedException();
        }

        try {
            return await this.jwtService.signAsync({userId: user.id, login: user.login, role: user.role});
        } catch(err) {
            throw new UnauthorizedException();
        }
    }

    async register(data: UserRegisterDto): Promise<any> {
        let user = await this.dbHelper.get(this.usersRepository, {where: {login: data.login}});

        if(user) {
            Promise.resolve('USER_EXISTS');
        }

        if(!user) {
            try {
                const customer = await this.stripeService.createCustomer(data.email);

                await this.dbHelper.set(this.usersRepository, {
                    login: data.login, 
                    password: data.password,
                    email: data.email,
                    role: Roles.ROLE_USER,
                    customerId: customer.id
                });
            } catch(err) {
                Promise.reject(err);
            }
        }

        user = await this.dbHelper.get(this.usersRepository, {where: {login: data.login}});

        try {
            return await this.jwtService.signAsync({userId: user.id, login: user.login, role: user.role});
        } catch(err) {
            Promise.reject(err);
        }
    }

    async deleteUser(id: number) {
        try {
            await this.dbHelper.delete(this.usersRepository, {where: {id: id}});
        } catch(err) {
            throw err;
        }
    }

    public async verify(token: string): Promise<any> {
        let jwtVerifier: JwtVerifier = new JwtVerifier();

        return await jwtVerifier.verify(this.jwtService, token);
    }
}
