import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { IPaymentIntent, IPaymentType, IStatus } from "../../interface/payment.interface";
import { Request } from "express";
import { Transaction } from "sequelize";
import { PaymentRepository } from "../../repositories/payment.repository";
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { AgentService } from "src/modules/agent/agent.service";
import { EmailService } from "src/shared/notification/email/email.service";
import { UsersModel } from "src/modules/users/models/users.model";
import { PetitionModel } from "src/modules/petition/model/petition.model";
import { emailPetitionType } from "src/modules/petition/interface/petition.interface";


@Injectable()
export class StripeService{
    private stripe: Stripe;

    constructor(
      private readonly paymentRepository: PaymentRepository,
      private readonly agentService: AgentService,
      private readonly emailService: EmailService,
      ) {
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
        
             const payment = await this.paymentRepository.update({ checkoutSessionId: session.id}, { status: IStatus.SUCCESSFUL });

             await this.processAgentReward(payment);

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
  
      let newStatus: IStatus;
  
      switch (session.payment_status) {
        case 'paid':
          newStatus = IStatus.SUCCESSFUL;

          await this.processAgentReward(payment);
          
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


    private async processAgentReward(payment: any){
      const includeOption = {
        include: [
           {
             model: UsersModel,
             attributes: ['firstName', 'lastName', 'email', 'id']
           },
           {
            model: PetitionModel
           }
          
         ]
        }

      const user = await this.paymentRepository.findOne({id: payment["id"]}, <unknown>includeOption);

       if(user.paymentOptionName === IPaymentType.PETITION_PREPARATION) await this.emailService.paymentConfirmation({email: user["user"].email, firstName: user["user"].firstName, petitionType: emailPetitionType[user["petition"].petitionType]});

       if(user.paymentOptionName === IPaymentType.REVIEW_PETITION) await this.emailService.finalPayment({email: user["user"].email, firstName: user["user"].firstName})


       const { userId, amount,  paymentOptionName} = payment.toJSON();

       const rewardAmount = (amount)/10;

       await this.agentService.updateAgentReward(userId, rewardAmount, paymentOptionName);
    }
}

