import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import User from './core/entities/user.entity';
import { ShopModule } from './shop/shop.module';
import { CoreModule } from './core/core.module';
import Product from './core/entities/product.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'sql11.freemysqlhosting.net',
      port: 3306,
      username: 'sql11441664',
      password: '1CYVhHp7AR',
      database: 'sql11441664',
      entities: [User, Product],
      synchronize: true,
    }),
    ShopModule,
    CoreModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
