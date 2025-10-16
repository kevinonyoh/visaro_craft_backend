import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { IPaymentIntent, IStatus } from "../../interface/payment.interface";
import { Request } from "express";
import { Transaction } from "sequelize";
import { PaymentRepository } from "../../repositories/payment.repository";
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";


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
       return await this.stripe.checkout.sessions.create({...data})
    }

    async webHook(sig, req: Request){
        const event = this.stripe.webhooks.constructEvent( 
        req.body,            
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
        )

        switch (event.type) {
          case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
        
            await this.paymentRepository.update({ checkoutSessionId: session.id}, { status: IStatus.SUCCESSFUL });
        
            this.logger.log(
              '========================================= Checkout session completed! Payment successful =========================================',
              session.id,
            );
            break;
          }
        
          case 'checkout.session.async_payment_failed':
          case 'checkout.session.expired': {
            const session = event.data.object as Stripe.Checkout.Session;
        
            await this.paymentRepository.update({ status: IStatus.FAILED }, { checkoutSessionId: session.id });
        
            this.logger.warn(
              '========================================= Checkout session failed or expired =========================================',
              session.id,
            );
            break;
          }
        
          case 'checkout.session.async_payment_succeeded': {
            const session = event.data.object as Stripe.Checkout.Session;
        
            await this.paymentRepository.update({ status: IStatus.SUCCESSFUL },{ checkoutSessionId: session.id });
        
            this.logger.log(
              '========================================= Async checkout payment succeeded =========================================',
              session.id,
            );
            break;
          }
        
          default:
            this.logger.error(`⚠️ Unhandled event type: ${event.type}`);
            break;
        }        
     
    }

    async verifyPayment(sessionId: string, transaction: Transaction) {
    
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
  
      
      const payment = await this.paymentRepository.findOne({ checkoutSessionId: sessionId });
  
      if (!payment) {
        throw new BadRequestException('Payment record not found');
      }
  
      // Determine new status based on Stripe session
      let newStatus: IStatus;
  
      switch (session.payment_status) {
        case 'paid':
          newStatus = IStatus.SUCCESSFUL;
          break;
        case 'unpaid':
          newStatus = IStatus.FAILED;
          break;
        case 'no_payment_required':
        default:
            newStatus = IStatus.PENDING;
            break;
      }
  
     return await this.paymentRepository.update({ checkoutSessionId: sessionId }, {status: newStatus}, transaction);

    }
}

