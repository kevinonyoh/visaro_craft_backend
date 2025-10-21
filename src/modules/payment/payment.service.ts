import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto, CreatePaymentIntentDto, QueryPaymentDto, UpdatePaymentOptionDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { StripeService } from './payment-factory/integration/stripe.service';
import { IUser } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { IFindPayment, IPaymentIntent, IStatus } from './interface/payment.interface';
import { PaymentOptionsRepository } from './repositories/payment-option.repository';
import { Request, Response } from 'express';
import { PaymentRepository } from './repositories/payment.repository';
import { Transaction } from 'sequelize';
import { PetitionService } from '../petition/petition.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly usersService: UsersService,
    private readonly petitionService: PetitionService,
    private readonly paymentOptionsRepository: PaymentOptionsRepository,
    private readonly paymentRepository: PaymentRepository
    ){}

   async createPaymentIntent(user: IUser, data: CreatePaymentIntentDto, transaction: Transaction){
      const userData = await this.usersService.getUserByEmail(user.email);

      if(!userData) throw new BadRequestException("user email does not exist");

      const { paymentOptionsId } = data;

      const petition = await this.petitionService.findUserPetition(user);

      const petitionJson = petition.toJSON();

      const payment = await this.paymentOptionsRepository.findOne({id: paymentOptionsId})

      if(!payment) throw new BadRequestException("payment type does not exist");

      const paymentJson = payment.toJSON();

      const payload = {
         payment_method_types: ['card'],
         mode: 'payment',
         line_items: [
           {
             price_data: {
               currency: 'usd',
               product_data: { name: paymentJson.name },
               unit_amount: paymentJson.amount,
             },
             quantity: 1,
           },
         ],
         success_url: 'https://visaro-dashboard.vercel.app/success_board'
       }

     const stripeData = await this.stripeService.testInitiatePayment(payload);

      const load = {
         userId: user.id,
         email: user.email,
         checkoutSessionId: stripeData.id,
         paymentUrl: stripeData.url,
         amount: paymentJson.amount,
         paymentOptionName: paymentJson.name,
         petitionId: petitionJson.id,
         paymentOptionsId
      }

       return await this.paymentRepository.create({...load}, transaction);
   }

   async webHookStripe(req: Request, res: Response, sig){
      return await this.stripeService.webHook(sig, req);
   }

   async confirmPayment(checkoutSessionId: string, transaction: Transaction){
       return await this.stripeService.verifyPayment(checkoutSessionId, transaction);
   }

   async updatePaymentOption(id: string, data: UpdatePaymentOptionDto, transaction: Transaction){
      const {amount, ...rest} = data;

      const payload = {
         amount: (amount * 100),
         ...rest
      }

      return await this.paymentOptionsRepository.update({id}, payload, transaction);
   }

   async  findPaymentOptions(){
      return await this.paymentOptionsRepository.findAll({});
   }

   async findSuccessfulPayment(data: IFindPayment){
       return await this.paymentRepository.findOne({...data, status: IStatus.SUCCESSFUL})
   }

   async findUserPayment(user:IUser, data: QueryPaymentDto){
      const {paymentType, ...rest} = data;
       return await this.paymentRepository.findAll({userId: user.id, ...rest, paymentOptionName: paymentType});
   }

   async findPayment(data: QueryPaymentDto){
      const {paymentType, ...rest} = data;
      return await this.paymentRepository.findAll({...rest, paymentOptionName: paymentType});
   }

}
