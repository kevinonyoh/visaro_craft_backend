import { BadRequestException, Injectable } from '@nestjs/common';
import { AgentPaymentRequestDto, CreateAgentDto, ForgetPasswordDto, ResetForgetPasswordDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentsRepository } from './repositories/agent.repository';
import { Transaction } from 'sequelize';
import { EmailService } from 'src/shared/notification/email/email.service';
import { CacheStoreService } from 'src/shared/cache-store/cache-store.service';
import * as helpers from "src/common/utils/helper";
import { IAgent, IAgentRewardStatus, IAgentTransactionStatus } from './interfaces/agent.interface';
import * as bcrypt from "bcrypt";
import { UsersModel } from '../users/models/users.model';
import { AgentRewardRepository } from './repositories/agent-reward.repository';
import { AgentRewardsModel } from './model/agent-reward.model';
import { getReferralCountQuery, totalEarningAndWithdrawQuery } from 'src/shared/database/raw-queries/scripts/agent-metric';
import queryRunner from 'src/shared/database/raw-queries/query-runner';
import { AgentTransactionRepository } from './repositories/Agent-transaction.repository';

@Injectable()
export class AgentService {

  constructor(
    private readonly agentsRepository: AgentsRepository,
    private readonly emailService: EmailService,
    private readonly cacheStoreService: CacheStoreService,
    private readonly agentRewardRepository: AgentRewardRepository,
    private readonly  agentTransactionRepository: AgentTransactionRepository
    ){}


  async create(data: CreateAgentDto, transation: Transaction) {
    const { password, email, firstName, pin, ...rest} = data;

    const user = await this.agentsRepository.findOne({email});

    if(user) throw new BadRequestException("email already exist");

    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(password, salt);

    const hashPin = await bcrypt.hash(pin, salt);
    
    const payload = {
     ...rest,
     firstName,
     password: hashPassword,
     pin: hashPin,
     email
    }

    const val = await this.agentsRepository.create(payload, transation);

    const userData = val.toJSON();

   await this.emailService.signUp({email, firstName});

   return userData;
 }

 async forgotpassword(data: ForgetPasswordDto){
  const {email} = data;

  const user = await this.agentsRepository.findOne({email});

  if(!user) throw new BadRequestException("Email does not exist");

  const userData = user.toJSON();

  const otp = helpers.generateOtp();

  await this.cacheStoreService.set(otp, email);

  await this.emailService.forgotPassword({email, firstName: userData.firstName, code: otp});
 }

 async verifyforgotpassword(data: ResetForgetPasswordDto, transaction: Transaction){
   const { email, otp, password } = data;

   const userEmail = await this.cacheStoreService.get(otp);
   
   if (userEmail !== email) throw new BadRequestException('Invalid otp');

   const salt = await bcrypt.genSalt();

   const hashPassword = await bcrypt.hash(password, salt);

   await this.agentsRepository.update({email}, {password: hashPassword}, transaction);
 }


 async findAgent(user: IAgent){
  const userdata = await this.agentsRepository.findOne({email:user.email});

  const userDataJson = userdata.toJSON();

  return userDataJson;
}

async findByEmail(email: string){
   return await this.agentsRepository.findOne({email})
}


async findAgentUsers(agent: IAgent){
  const includeOption = {
    include: [
       {
         model: UsersModel,
         attributes: { exclude: ['password'] },
         include: [
          {
            model: AgentRewardsModel,
          },
        ]
       }
     ]
  }
  return await this.agentsRepository.findOne({id: agent.id}, <unknown>includeOption);
}



async createAgentReward(userId: string, transaction: Transaction){
   const payload = {
     userId,
     status: IAgentRewardStatus.PENDING,
     stage: 0
   }

   await this.agentRewardRepository.create(payload, transaction);
}

async updateAgentReward(userId: string, rewardAmount: number){
   const data =  await this.agentRewardRepository.findOne({userId});

   if(!data) return;

   const {stage, status} = data.toJSON();

   if(status === IAgentRewardStatus.PENDING && stage === 0){ 

       const payload = {
        rewardAmount,
        stage: 1,
        status: IAgentRewardStatus.IN_PROGRESS
       }

       await this.agentRewardRepository.update({userId}, {...payload});

   } else if(status === IAgentRewardStatus.IN_PROGRESS && stage === 1){
    
      const payload = {
        rewardAmount,
        stage: 2,
        status: IAgentRewardStatus.COMPLETED
      }

      await this.agentRewardRepository.update({userId}, {...payload});
   }
}

async findReferralCounts(agent: IAgent){
   const [result] = await queryRunner<any[]>(getReferralCountQuery, {agentId: agent.id});

  return {
    ...result
  };
}

async requestPayment(agent: IAgent, data: AgentPaymentRequestDto, transaction: Transaction){
  const [result] = await queryRunner<any[]>(totalEarningAndWithdrawQuery, {agentId: agent.id});

  const {amount, pin} = data;

  const {total_earnings, total_withdrawn} = result;

  const totalEarn = Number(total_earnings) || 0;
  
  const totalWithdrawn = Number(total_withdrawn) || 0;

  const availableBalance = totalEarn - totalWithdrawn;
  
  if (amount > availableBalance) throw new BadRequestException('Insufficient balance for withdrawal');

  const user = await this.agentsRepository.findOne({id: agent.id});

  const comparePin = bcrypt.compareSync(pin, user.pin);

  if(!comparePin) throw new BadRequestException("incorrect pin");

  const payload = {
     agentId: agent.id,
     amount,
     status: IAgentTransactionStatus.PENDING
  }

  return await this.agentTransactionRepository.create(payload, transaction);
}

}
