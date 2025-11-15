import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import {CreateUserDto, EmailVerifyDto, ForgetPasswordDto, ResetForgetPasswordDto, SendOtpDto, UploadCVDto, changePasswordDto } from './dto/create-user.dto';
import { TransactionParam } from 'src/common/decorators/transaction-param.decorator';
import { Transaction } from 'sequelize';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditTrailService } from '../audit-trail/audit-trail.service';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditTrailService: AuditTrailService
    ) {}

  @Public()
  @Post("agent/create/:username")
  @HttpCode(201)
  @ResponseMessage("new courses created successfully")
  async createUserByAgent(@Param("username") username: string, @Body() body: CreateUserDto, @TransactionParam() transaction: Transaction) {
    return await  this.usersService.createUserByAgent(username, body, transaction);
  }

  @Public()
  @Post("create")
  @HttpCode(201)
  @ResponseMessage("new courses created successfully")
  async create(@Body() body: CreateUserDto, @TransactionParam() transaction: Transaction) {
    return await  this.usersService.create(body, transaction);
  }


  @Public()
  @Post("forget-password")
  @HttpCode(200)
  @ResponseMessage("check your mail verify your otp code")
  async forgetPassword(@Body() body: ForgetPasswordDto){
     return await this.usersService.forgotpassword(body);
  }

  @Public()
  @Put("reset-forget-password")
  @HttpCode(200)
  @ResponseMessage("password reset successfully")
  async verifyForgetPasswordOtp(@Body() body: ResetForgetPasswordDto, @TransactionParam() transaction: Transaction){
     return await this.usersService.verifyforgotpassword(body, transaction);
  }

  @Get("user-profile")
  @HttpCode(200)
  @ResponseMessage("user profile")
  async userProfile(@User() user: IUser){
    return await this.usersService.findUser(user)
  }

  @Put("upload-cv")
  @HttpCode(200)
  @ResponseMessage("cv uploaded successfully")
  async uploadCv(@User() user: IUser, @Body() body: UploadCVDto, @TransactionParam() transaction: Transaction){
     return await this.usersService.uploadCV(user, body, transaction);
  }

  @Put("update-user-profile")
  @HttpCode(200)
  @ResponseMessage("update successfully")
  async updateProfile(@User() user: IUser, @Body() body: UpdateUserDto, @TransactionParam() transaction: Transaction){
    return await this.usersService.updateProfile(user, body, transaction);
  }

  @Put("update-password")
  @HttpCode(200)
  @ResponseMessage("user password updated successfully")
  async updatePassword(@User() user: IUser, @Body() body: changePasswordDto, @TransactionParam() transaction: Transaction){
    return await this.usersService.updatePassword(user, body, transaction);
  }

  @Public()
  @Post('verify-email/send-otp')
  @HttpCode(200)
  @ResponseMessage('Otp sent successfully')
  async resendVerifyEmailOtp(@Body() body: SendOtpDto) {
    return await this.usersService.sendEmailVerficationOtp(body);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(200)
  @ResponseMessage('Email verified successfully. Account activated.')
  async verifyEmail(@Body() body: EmailVerifyDto, @TransactionParam() transaction: Transaction) {
    return await this.usersService.VerifyEmail(body, transaction);
  }

  @Get("notification")
  @HttpCode(200)
  @ResponseMessage("user notification")
  async agentNotification(@User() user:IUser){
    return await this.auditTrailService.findUserNotification(user.id);
  }

}
