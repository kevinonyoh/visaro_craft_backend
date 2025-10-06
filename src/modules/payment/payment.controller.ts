import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req, Res, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, CreatePaymentIntentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { IUser } from '../users/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { TransactionParam } from 'src/common/decorators/transaction-param.decorator';
import { Transaction } from 'sequelize';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create-payment-intent")
  @HttpCode(201)
  @ResponseMessage("payment intent successfully created")
  async createPaymentIntent(@User() user: IUser, @Body() body:CreatePaymentIntentDto, @TransactionParam() transaction: Transaction){
     return await this.paymentService.createPaymentIntent(user, body, transaction);
  }

  @Public()
  @Post("webHook")
  @HttpCode(200)
  @ResponseMessage("webhook")
  async webHookStripe( @Req() req: Request, @Res() res: Response, @Headers('stripe-signature') sig: string){
      return await this.paymentService.webHookStripe(req, res, sig);
  }

  @Get("confirm-payment/:paymentIntentId")
  @HttpCode(200)
  @ResponseMessage("payment successfull")
  async confirmStripPayment(@Param("paymentIntentId") paymentIntentId: string){
      return await this.paymentService.confirmPayment(paymentIntentId);
  }

 }
