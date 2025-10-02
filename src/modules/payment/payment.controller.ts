import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, CreatePaymentIntentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { IUser } from '../users/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create-payment-intent")
  @HttpCode(201)
  @ResponseMessage("payment intent successfully created")
  async createPaymentIntent(@User() user: IUser, @Body() body:CreatePaymentIntentDto){
     return await this.paymentService.createPaymentIntent(user, body);
  }

 }
