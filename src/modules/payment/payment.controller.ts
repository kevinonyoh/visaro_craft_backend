import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req, Res, Headers, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, CreatePaymentIntentDto, QueryPaymentDto, UpdatePaymentOptionDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { IUser } from '../users/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { TransactionParam } from 'src/common/decorators/transaction-param.decorator';
import { Transaction } from 'sequelize';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { IsLogin } from 'src/common/decorators/login.decorator';

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
  async webHookStripe(@Req() req: Request, @Res() res: Response, @Headers('stripe-signature') sig: string){
      return await this.paymentService.webHookStripe(req, res, sig);
  }


  @IsLogin()
  @Get("verify-payment/:checkoutSessionId")
  @HttpCode(200)
  @ResponseMessage("payment confirmation")
  async confirmPayment(@Param("checkoutSessionId") checkoutSessionId: string, @TransactionParam() transaction: Transaction){
     return await this.paymentService.confirmPayment(checkoutSessionId, transaction);
  }



  @IsAdmin()
  @Post("update-payment-option/:id")
  @HttpCode(200)
  @ResponseMessage("payment option updated successfully")
  async updatePaymentOption(@Param("id") id:string, @Body() body: UpdatePaymentOptionDto, @TransactionParam() transaction: Transaction){
     return await this.paymentService.updatePaymentOption(id, body, transaction);
  }


  @IsLogin()
  @Get("view-payment-option")
  @HttpCode(200)
  @ResponseMessage("payment options")
  async getPaymentOptions(){
     return await this.paymentService.findPaymentOptions();
  }

  @Get("user-payment-history")
  @HttpCode(200)
  @ResponseMessage("payment history")
  async getUserPayment(@User() user: IUser, @Query() query: QueryPaymentDto){
     return await this.paymentService.findUserPayment(user, query);
  }

  @IsAdmin()
  @Get("payment-history")
  @ResponseMessage("payment history")
  async getPaymentHistory(@Query() query: QueryPaymentDto){
     return await this.paymentService.findPayment(query);
  }


 }
