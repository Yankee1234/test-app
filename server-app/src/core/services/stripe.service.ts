import { Injectable } from "@nestjs/common";
import { throws } from "assert";
import { timeStamp } from "console";
import exp from "constants";
import { Observable } from "rxjs";
import Stripe from "stripe";

@Injectable()
export class StripeService {
    private readonly instanceStripe: Stripe;
    constructor() {
        this.instanceStripe = new Stripe(
            'sk_test_51JaJPoEQZENeeWWUotTer2wCCqdP7HYLDL8ZVFLRKXGpxD3HNiX1UjhvqKc67QGIogZy6XfhqimzNkoSEja393WR00KXoAHrAQ',
            {apiVersion: '2020-08-27'}
        )
    }

    async createCustomer(email: string): Promise<any> {
        try {
            const paymentMethod = await this.createDefaultPaymentMethodId();
            
            const customer = await this.instanceStripe.customers.create({
                email: email
            })

            await this.instanceStripe.paymentMethods.attach(
                paymentMethod.id,
                {customer: customer.id}
            )

            return customer;

        } catch(err) {
            throw err;
        }
    }

    async getCustomerPaymentMethodId(customerId: string): Promise<string> {
        try {
            const pm = await this.instanceStripe.paymentMethods.list({
                customer: customerId,
                type: 'card',
            }); 
            return pm.data[0].id;
        } catch(err) {
            throw err;
        }
        
    }

    async createDefaultPaymentMethodId(): Promise<any> {
        try {
            return await this.instanceStripe.paymentMethods.create({
                type: 'card',
                card: {
                    number: '4242424242424242',
                    exp_month: 12,
                    exp_year: 2025,
                    cvc: '333',
                },
            })
        } catch(err) {
            throw err;
        }
    }

    async getCustomers() {
        try {
            return await this.instanceStripe.customers.list();
        } catch(err) {
            throw err;
        }
    }

    async createPaymentIntent(options: any): Promise<any> {
        try {
            return await this.instanceStripe.paymentIntents.create({
                amount: options.price * 100,
                currency: 'usd',
                payment_method_types: ['card'],
                confirm: true,
                customer: options.customerId,
                payment_method: await this.getCustomerPaymentMethodId(options.customerId)
            })
        } catch(err) {
            throw err;
        }
    }
}