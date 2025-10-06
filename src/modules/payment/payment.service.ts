import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto, CreatePaymentIntentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { StripeService } from './payment-factory/integration/stripe.service';
import { IUser } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { IPaymentIntent, IStatus } from './interface/payment.interface';
import { PaymentOptionsRepository } from './repositories/payment-option.repository';
import { Request, Response } from 'express';
import { PaymentRepository } from './repositories/payment.repository';
import { Transaction } from 'sequelize';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly usersService: UsersService,
    private readonly paymentOptionsRepository: PaymentOptionsRepository,
    private readonly paymentRepository: PaymentRepository
    ){}

   async createPaymentIntent(user: IUser, data: CreatePaymentIntentDto, transaction: Transaction){
      const userData = await this.usersService.getUserByEmail(user.email);

      if(!userData) throw new BadRequestException("user email does not exist");

      const {paymentType} = data;

      const payment = await this.paymentOptionsRepository.findOne({name: paymentType})

      if(!payment) throw new BadRequestException("payment type does not exist");

      const paymentJson = payment.toJSON();

      const payload: IPaymentIntent = {
         amount: paymentJson.amount,
         currency: paymentJson.currency,
         metadata: {
          paymentType: payment.name,
          userId: user.id
         },
         receipt_email: user.email,
         payment_method_types: ['card'],
         description: `${payment.name} payment`
      }

      const {id, client_secret} =  await this.stripeService.testInitiatePayment(payload);

      const load = {
         userId: user.id,
         email: user.email,
         stripeId: id,
         stripeClientSecret: client_secret,
         amount: paymentJson.amount,
         serviceType: paymentJson.name
      }

      return await this.paymentRepository.create({...load}, transaction);

   }

   async webHookStripe(req: Request, res: Response, sig){
      return await this.stripeService.webHook(sig, req);
   }

   async confirmPayment(paymentIntentId: string){
       return await this.stripeService.confirmPayment(paymentIntentId);
   }
}
