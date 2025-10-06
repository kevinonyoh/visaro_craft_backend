import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { IPaymentIntent, IStatus } from "../../interface/payment.interface";
import { Request } from "express";
import { Transaction } from "sequelize";
import { PaymentRepository } from "../../repositories/payment.repository";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";


@Injectable()
export class StripeService{
    private stripe: Stripe;

    constructor(private readonly paymentRepository: PaymentRepository) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-09-30.clover'
        });
      }
    private readonly logger = new Logger(StripeService.name);

    async initiatePayment(data: IPaymentIntent){
       return await this.stripe.paymentIntents.create({...data});
    }
      
    async testInitiatePayment(data){
       return await this.stripe.paymentIntents.create({...data});
    }

    async webHook(sig, req: Request){
        const event = this.stripe.webhooks.constructEvent( 
        req.body,            
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
        )

        switch (event.type) {
            case 'payment_intent.succeeded':
              const paymentIntent = event.data.object as Stripe.PaymentIntent;

               const data = await this.paymentRepository.update({stripeId: paymentIntent.id}, {status: IStatus.SUCCESSFUL})

              this.logger.debug(`=========================================Payment was successful!=================================`, data);
              break;
      
            case 'payment_intent.payment_failed':
              const failedIntent = event.data.object as Stripe.PaymentIntent;

               const val = await this.paymentRepository.update({stripeId: failedIntent.id}, {status: IStatus.FAILED})

              this.logger.log('=========================================Payment failed! ========================================', val);
              break;

            case 'payment_intent.created':
              const createIntent = event.data.object as Stripe.PaymentIntent;

              this.logger.log('========================================Payment Intent created successfully! =========================', createIntent);
              break;

            default:
              this.logger.error(`Unhandled event type ${event.type}`);
          }
    }

    async confirmPayment(paymentIntentId: string){
      const {status} = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if(status === "succeeded") {
       this.logger.debug(`=========================================Payment was successful!=================================`);    
    
         return await this.paymentRepository.update({stripeId: paymentIntentId}, {status: IStatus.SUCCESSFUL});
      }

        throw new BadRequestException("Payment failed. A valid payment method is required or the transaction was declined.")
     }
}

