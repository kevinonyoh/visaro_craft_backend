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
import { AuditTrailService } from '../audit-trail/audit-trail.service';
import { Agent } from 'src/common/decorators/agent.decorator';


@IsAdmin()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly agentService: AgentService,
    private readonly auditTrailService: AuditTrailService
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

  @Get("dashboard-metric")
  @HttpCode(200)
  @ResponseMessage("dashboard metric")
  async getAdminDashboardMetric(){
    return await this.adminService.adminDashboardMetric();
  }
 
  @Get("petition-metric")
  @HttpCode(200)
  @ResponseMessage("petition metric")
  async getAdminPetitionMetric(){
    return await this.adminService.petitionMetric();
  }

  @Get("user-metric")
  @HttpCode(200)
  @ResponseMessage("user metric")
  async getUserMetric(){
    return await this.adminService.userMetric();
  }

  @Get("agent-metric")
  @HttpCode(200)
  @ResponseMessage("agent metric")
  async getAgentMetric(){
    return await this.adminService.agentMetric();
  }

  @Get("financial-metric")
  @HttpCode(200)
  @ResponseMessage("financial metric")
  async getFinancialMetric(){
    return await this.adminService.financialMetric();
  }

  @Get("activities")
  @HttpCode(200)
  @ResponseMessage("activities data")
  async getActivities(){
    return await this.auditTrailService.findActivities();
  }

  @Get("Agent-data")
  @HttpCode(200)
  @ResponseMessage("agent payout history")
  async getAgent(){
    return await this.agentService.getAgentData();
  }

  @Get("agent-data/:agentId")
  @HttpCode(200)
  @ResponseMessage("Agent data")
  async getAgentReferUsers(@Param("agentId") agentId: string){
    return await this.agentService.agentReferUsers(agentId);
  }

  @Get("agent-payout")
  @HttpCode(200)
  @ResponseMessage("Payout details")
  async getPayout(){
    return await this.agentService.findPayout();
  }

}
