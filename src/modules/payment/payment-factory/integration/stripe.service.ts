import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { IPaymentIntent } from "../../interface/payment.interface";

export class StripeService{
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-09-30.clover'
        });
      }

    async initiatePayment(data: IPaymentIntent){
       return this.stripe.paymentIntents.create({...data});
    }
      
}

