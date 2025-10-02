import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto, CreatePaymentIntentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { StripeService } from './payment-factory/integration/stripe.service';
import { IUser } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { IPaymentIntent } from './interface/payment.interface';
import { PaymentOptionsRepository } from './repositories/payment-option.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly usersService: UsersService,
    private readonly paymentOptionsRepository: PaymentOptionsRepository
    ){}

   async createPaymentIntent(user: IUser, data: CreatePaymentIntentDto){
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

      return this.stripeService.initiatePayment(payload);

   }
}
