import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { token } from 'src/core/constants/jwt.const';
import { CoreModule } from 'src/core/core.module';
import User from 'src/core/entities/user.entity';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { DbHelper } from 'src/core/helpers/db.helper';
import { StripeService } from 'src/core/services/stripe.service';
import { JwtStrategy } from 'src/core/strategy/jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    CoreModule,
    PassportModule,
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
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtAuthGuard, DbHelper, StripeService],
  exports: [UserService]
  
})
export class UserModule {}
