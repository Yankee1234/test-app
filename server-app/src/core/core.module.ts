import { Module } from '@nestjs/common';
import { DbHelper } from './helpers/db.helper';
import { StripeService } from './services/stripe.service';

@Module({
    providers: [
        StripeService, 
        DbHelper
    ],
    exports: [
        StripeService,
        DbHelper
    ]
})
export class CoreModule {}
