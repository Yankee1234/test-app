import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { token } from 'src/core/constants/jwt.const';
import { CoreModule } from 'src/core/core.module';
import Product from 'src/core/entities/product.entity';
import User from 'src/core/entities/user.entity';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { DbHelper } from 'src/core/helpers/db.helper';
import { JwtStrategy } from 'src/core/strategy/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [
    UserModule,
    CoreModule,
    JwtModule.registerAsync({ 
      useFactory: async () => ({
        signOptions: {
          expiresIn: '2h',
          algorithm: 'HS256'
        },
        secret: token.secretKey, 
        verifyOptions: {
          algorithms: ['HS256']
        }
      })
    }),
    TypeOrmModule.forFeature([User, Product])
  ],
  controllers: [ShopController],
  providers: [ShopService, JwtStrategy, JwtAuthGuard, DbHelper, UserService],
  exports: [ShopService]
})
export class ShopModule {}
