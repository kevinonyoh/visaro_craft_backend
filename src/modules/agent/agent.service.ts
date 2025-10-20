import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAgentDto, ForgetPasswordDto, ResetForgetPasswordDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentsRepository } from './repositories/agent.repository';
import { Transaction } from 'sequelize';
import { EmailService } from 'src/shared/notification/email/email.service';
import { CacheStoreService } from 'src/shared/cache-store/cache-store.service';
import * as helpers from "src/common/utils/helper";
import { IAgent } from './interfaces/agent.interface';
import * as bcrypt from "bcrypt";

@Injectable()
export class AgentService {

  constructor(
    private readonly agentsRepository: AgentsRepository,
    private readonly emailService: EmailService,
    private readonly cacheStoreService: CacheStoreService
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

}
