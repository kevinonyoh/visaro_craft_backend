import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, ForgetPasswordDto, ResetForgetPasswordDto, UploadCVDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransactionParam } from 'src/common/decorators/transaction-param.decorator';
import { Transaction } from 'sequelize';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from './interfaces/user.interface';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

}
