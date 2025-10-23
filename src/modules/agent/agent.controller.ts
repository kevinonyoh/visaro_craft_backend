import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Put } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentPaymentRequestDto, CreateAgentDto, ForgetPasswordDto, ResetForgetPasswordDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Transaction } from 'sequelize';
import { TransactionParam } from 'src/common/decorators/transaction-param.decorator';
import { Agent } from 'src/common/decorators/agent.decorator';
import { IAgent } from './interfaces/agent.interface';
import { IsAgent } from 'src/common/decorators/is-agent.decorator';



@IsAgent()
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

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

  @Post("request-payment")
  @HttpCode(200)
  @ResponseMessage("payment request created successfully")
  async requestPayment(@Agent() agent: IAgent, @Body() body: AgentPaymentRequestDto, @TransactionParam() transaction: Transaction){
    return await this.agentService.requestPayment(agent, body, transaction);
  }
}
