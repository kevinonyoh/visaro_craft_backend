import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, ForgetPasswordDto, ResetForgetPasswordDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { TransactionParam } from 'src/common/decorators/transaction-param.decorator';
import { Transaction } from 'sequelize';
import { IAdmin } from './interfaces/admin.interface';
import { Admin } from 'src/common/decorators/admin.decorator';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { AgentService } from '../agent/agent.service';
import { UpdateStatusPayoutDto } from '../agent/dto/create-agent.dto';


@IsAdmin()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly agentService: AgentService
    ) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Public()
  @Post("forget-password")
  @HttpCode(200)
  @ResponseMessage("check your mail verify your otp code")
  async forgetPassword(@Body() body: ForgetPasswordDto){
     return await this.adminService.forgotpassword(body);
  }

  @Public()
  @Put("reset-forget-password")
  @HttpCode(200)
  @ResponseMessage("password reset successfully")
  async verifyForgetPasswordOtp(@Body() body: ResetForgetPasswordDto, @TransactionParam() transaction: Transaction){
     return await this.adminService.verifyforgotpassword(body, transaction);
  }


  @Get("profile")
  @HttpCode(200)
  @ResponseMessage("user profile")
  async adminProfile(@Admin() admin: IAdmin){
    return await this.adminService.findAdminProfile(admin)
  }

  @Get("all-users")
  @HttpCode(200)
  @ResponseMessage("All users profile")
  async getAllUserProfile(){
    return await this.adminService.findAllUsers();
  }

  @Get("user/:id")
  @HttpCode(200)
  @ResponseMessage("user profile")
  async getUserProfile(@Param("id") id: string){
    return await this.adminService.findUser(id);
  }

  @Put("update-payout-request-status/:id")
  @HttpCode(200)
  @ResponseMessage("Status update Successfully")
  async updatePayoutRequestStatus(@Admin() admin: IAdmin, @Param("id") id: string, @Body() body: UpdateStatusPayoutDto, @TransactionParam() transaction: Transaction){
    return await this.agentService.updatePayoutRequestStatus(admin, id, body, transaction);
  }
 
}
