import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { AgentPaymentRequestDto, CreateAgentDto, ForgetPasswordDto, ResetForgetPasswordDto, UpdateStatusPayoutDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentsRepository } from './repositories/agent.repository';
import { Sequelize, Transaction, col, fn } from 'sequelize';
import { EmailService } from 'src/shared/notification/email/email.service';
import { CacheStoreService } from 'src/shared/cache-store/cache-store.service';
import * as helpers from "src/common/utils/helper";
import { IAgent, IAgentRewardStatus, IAgentTransactionStatus } from './interfaces/agent.interface';
import * as bcrypt from "bcrypt";
import { UsersModel } from '../users/models/users.model';
import { AgentRewardRepository } from './repositories/agent-reward.repository';
import { AgentRewardsModel } from './model/agent-reward.model';
import { dashboardQuery, getReferralCountQuery, payoutQuery, totalEarningAndWithdrawQuery } from 'src/shared/database/raw-queries/scripts/agent-metric';
import queryRunner from 'src/shared/database/raw-queries/query-runner';
import { AgentTransactionRepository } from './repositories/Agent-transaction.repository';
import { IPaymentType } from '../payment/interface/payment.interface';
import { IAdmin } from '../admin/interfaces/admin.interface';
import { AuditTrailService } from '../audit-trail/audit-trail.service';
import { UsersService } from '../users/users.service';
import { availableBalance, totalPayout, totalReferUser, totalRewardEarned } from 'src/shared/database/raw-queries/literals';
import { AgentTransactionModel } from './model/agent-transaction.model';
import { PetitionModel } from '../petition/model/petition.model';
import { PetitionStageModel } from '../petition/model/petition-stage.model';


@Injectable()
export class AgentService {

  constructor(
    private readonly agentsRepository: AgentsRepository,
    private readonly emailService: EmailService,
    private readonly cacheStoreService: CacheStoreService,
    private readonly agentRewardRepository: AgentRewardRepository,
    private readonly  agentTransactionRepository: AgentTransactionRepository,
    private readonly auditTrailService: AuditTrailService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
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

   const description = `New Agent: ${userData["firstName"]} ${userData["lastName"]}`
 
   await this.auditTrailService.create(description, transation);

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
       },
     ],
     order: [['updatedAt', 'DESC']]
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

async updateAgentReward(userId: string, rewardAmount: number, paymentOptionName: string){
   const data =  await this.agentRewardRepository.findOne({userId});

   const userData = await this.usersService.findUserById(userId)

   const agent = await this.agentsRepository.findOne({id: userData["agentId"]});
   

   if(!data) return;

   const dataJson = data.toJSON();

   if(dataJson.status === IAgentRewardStatus.PENDING && dataJson.stage === 0 && paymentOptionName === IPaymentType.PETITION_PREPARATION){ 

       const payload = {
        rewardAmount,
        stage: 1,
        status: IAgentRewardStatus.IN_PROGRESS
       }

       await this.agentRewardRepository.update({userId}, {...payload});

   } else if(dataJson.status === IAgentRewardStatus.IN_PROGRESS && dataJson.stage === 1 && paymentOptionName === IPaymentType.REVIEW_PETITION){
    
      const payload = {
        rewardAmount: dataJson.rewardAmount+rewardAmount,
        stage: 2,
        status: IAgentRewardStatus.COMPLETED
      }

      await this.agentRewardRepository.update({userId}, {...payload});
   }

   const description = `${agent["firstName"]} ${agent["lastName"]}: New reward unlock`;
 
   await this.auditTrailService.create(description);

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

  const agentData = await this.agentsRepository.findOne({id: agent.id});

  const user = await this.agentsRepository.findOne({id: agent.id});

  const comparePin = bcrypt.compareSync(pin, user.pin);

  if(!comparePin) throw new BadRequestException("incorrect pin");

  const payload = {
     agentId: agent.id,
     amount,
     status: IAgentTransactionStatus.PENDING
  }

  const description = `Payout request from ${agentData["firstName"]} ${agentData["lastName"]}`;
 
  await this.auditTrailService.create(description, transaction);


  return await this.agentTransactionRepository.create(payload, transaction);
}


async dashboardMetric(agent: IAgent){
  const [result] = await queryRunner<any[]>(dashboardQuery, {agentId: agent.id});

  return {
    ...result
  }
}

async findPayoutHistory(agent: IAgent){
   return await this.agentTransactionRepository.findAll({agentId: agent.id});
}

async findPayoutMetric(agent: IAgent){
  const [result] = await queryRunner<any[]>(payoutQuery, {agentId: agent.id});

  return {
    ...result
  }
}

async updatePayoutRequestStatus(admin: IAdmin, id: string, data: UpdateStatusPayoutDto, transaction: Transaction){
  const { agentId } = data;

  const payload = {
    approvedBy: admin.id,
    approvedAt: Date(),
    ...data
  } 

  

  return await this.agentTransactionRepository.update({agentId, id}, payload, transaction);
}


async getAgentData(){

  const includeOption = {
    attributes: {
      include: [
        [fn('COUNT', col('user.id')), 'totalReferredUsers'],

        [
          Sequelize.literal(totalRewardEarned),
          'totalRewardsEarned',
        ],
      
        [
          Sequelize.literal(totalPayout),
          'totalPayout'
        ],

        [
          Sequelize.literal(availableBalance),
          'availableBalance'
        ]
      ],
      exclude: ['password', 'pin'],
    },
    include: [
      {
        model: UsersModel,
        attributes: [],
      },
    ],
    group: ['AgentsModel.id'],
    order: [[Sequelize.literal('"totalReferredUsers"'), 'DESC']]
  }

 return await this.agentsRepository.findAll({}, <unknown>includeOption)
}

async agentReferUsers(agentId: string){
  const includeOption = {
    attributes: {
      exclude: ['password', 'pin'],
    },
    include: [
      {
        model: UsersModel,
        attributes: {
          exclude: ['password'], 
        },
        include: [
          {
            model: PetitionModel,
            include: [
              {
                model: PetitionStageModel
              }
            ],
            attributes: { exclude: [] }, 
          },
        ],
      },
    ],
  };
  

   return await this.agentsRepository.findAll({id: agentId}, <unknown>includeOption);
}

async findPayout(){
  return await this.agentTransactionRepository.findAll({});
}

}
