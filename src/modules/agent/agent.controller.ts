import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Put } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentPaymentRequestDto, CreateAgentDto, EmailVerifyDto, ForgetPasswordDto, ResetForgetPasswordDto, SendOtpDto, UpdateAgentDataDto, changeBankDto, changePasswordDto, changePinDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Transaction } from 'sequelize';
import { TransactionParam } from 'src/common/decorators/transaction-param.decorator';
import { Agent } from 'src/common/decorators/agent.decorator';
import { IAgent } from './interfaces/agent.interface';
import { IsAgent } from 'src/common/decorators/is-agent.decorator';
import { AuditTrailService } from '../audit-trail/audit-trail.service';




@IsAgent()
@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly auditTrailService: AuditTrailService
    ) {}

  @Public()
  @Post("create")
  @HttpCode(201)
  @ResponseMessage("Agent created successfully")
  async create(@Body() body: CreateAgentDto, @TransactionParam() transaction: Transaction) {
    return await  this.agentService.create(body, transaction);
  }


  @Public()
  @Post("forget-password")
  @HttpCode(200)
  @ResponseMessage("check your mail verify your otp code")
  async forgetPassword(@Body() body: ForgetPasswordDto){
     return await this.agentService.forgotpassword(body);
  }

  @Public()
  @Put("reset-forget-password")
  @HttpCode(200)
  @ResponseMessage("password reset successfully")
  async verifyForgetPasswordOtp(@Body() body: ResetForgetPasswordDto, @TransactionParam() transaction: Transaction){
     return await this.agentService.verifyforgotpassword(body, transaction);
  }

  @Get("Agent-profile")
  @HttpCode(200)
  @ResponseMessage("user profile")
  async userProfile(@Agent() agent: IAgent){
    return await this.agentService.findAgent(agent)
  }

  @Get("refer-users")
  @HttpCode(200)
  @ResponseMessage("users refer by agent")
  async getReferUsers(@Agent() agent: IAgent){
    return await this.agentService.findAgentUsers(agent);
  }
 
  @Get("referrals-metrics")
  @HttpCode(200)
  @ResponseMessage("referrals metrics")
  async getReferralCount(@Agent() agent: IAgent){
    return await this.agentService.findReferralCounts(agent);
  }

  @Get("dashboard-metrics")
  @HttpCode(200)
  @ResponseMessage("dashboard metrics")
  async getDashboardCount(@Agent() agent: IAgent){
    return await this.agentService.dashboardMetric(agent);
  }

  @Post("request-payment")
  @HttpCode(200)
  @ResponseMessage("payment request created successfully")
  async requestPayment(@Agent() agent: IAgent, @Body() body: AgentPaymentRequestDto, @TransactionParam() transaction: Transaction){
    return await this.agentService.requestPayment(agent, body, transaction);
  }

  @Get("payout-history")
  @HttpCode(200)
  @ResponseMessage("agent payout history")
  async payoutHistory(@Agent() agent:IAgent){
    return await this.agentService.findPayoutHistory(agent);
  }

  @Get("payout-metrics")
  @HttpCode(200)
  @ResponseMessage("agent payout history")
  async payoutMetrics(@Agent() agent:IAgent){
    return await this.agentService.findPayoutMetric(agent);
  }

  @Put("update-agent-profile")
  @HttpCode(200)
  @ResponseMessage("agent profile updated successfully")
  async updateAgentProfile(@Agent() agent: IAgent, @Body() body: UpdateAgentDataDto, @TransactionParam() transaction: Transaction){
    return await this.agentService.updateProfile(agent, body, transaction);
  }

  @Put("update-password")
  @HttpCode(200)
  @ResponseMessage("agent password updated successfully")
  async updatePassword(@Agent() agent: IAgent, @Body() body: changePasswordDto, @TransactionParam() transaction: Transaction){
    return await this.agentService.updatePassword(agent, body, transaction);
  }
  
  @Put("update-pin")
  @HttpCode(200)
  @ResponseMessage("agent pin updated successfully")
  async updatePin(@Agent() agent: IAgent, @Body() body: changePinDto, @TransactionParam() transaction: Transaction){
    return await this.agentService.updatePin(agent, body, transaction);
  }

  @Put("update-bank")
  @HttpCode(200)
  @ResponseMessage("agent bank updated successfully")
  async updateBank(@Agent() agent: IAgent, @Body() body: changeBankDto, @TransactionParam() transaction: Transaction){
    return await this.agentService.updateBank(agent, body, transaction);
  }

  @Public()
  @Post('verify-email/send-otp')
  @HttpCode(200)
  @ResponseMessage('Otp sent successfully')
  async resendVerifyEmailOtp(@Body() body: SendOtpDto) {
    return await this.agentService.sendEmailVerficationOtp(body);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(200)
  @ResponseMessage('Email verified successfully. Account activated.')
  async verifyEmail(@Body() body: EmailVerifyDto, @TransactionParam() transaction: Transaction) {
    return await this.agentService.VerifyEmail(body, transaction);
  }

  @Get("notification")
  @HttpCode(200)
  @ResponseMessage("agent notification")
  async agentNotification(@Agent() agent:IAgent){
    return await this.auditTrailService.findAgentNotification(agent.id);
  }

}
