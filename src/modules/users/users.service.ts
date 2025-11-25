import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto, EmailVerifyDto, ForgetPasswordDto, ResetForgetPasswordDto, SendOtpDto, UploadCVDto, changePasswordDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { Transaction } from 'sequelize';
import * as bcrypt from "bcrypt";
import * as helpers from "src/common/utils/helper";
import { EmailService } from 'src/shared/notification/email/email.service';
import { CacheStoreService } from 'src/shared/cache-store/cache-store.service';
import { IUser } from './interfaces/user.interface';
import { AgentService } from '../agent/agent.service';
import { AuditTrailService } from '../audit-trail/audit-trail.service';
import { Petition } from '../petition/entities/petition.entity';
import { PetitionModel } from '../petition/model/petition.model';
import { PetitionStageModel } from '../petition/model/petition-stage.model';
import { INotification } from '../audit-trail/interface/notification.interface';


@Injectable()
export class UsersService {

  constructor(
    private readonly usersRepository: UsersRepository, 
    private readonly emailService: EmailService,
    private readonly cacheStoreService: CacheStoreService,
    private readonly auditTrailService: AuditTrailService,
    @Inject(forwardRef(() => AgentService))
    private readonly agentService: AgentService,
    ){}


    async createUserByAgent(username: string, data: CreateUserDto, transaction: Transaction){
      const { password, email, firstName, ...rest} = data;

      const agent = await this.agentService.findByUserName(username);

      if(!agent) throw new BadRequestException("Invalid reference link");

      const user = await this.usersRepository.findOne({email});

     if(user) throw new BadRequestException("email already exist");

     const salt = await bcrypt.genSalt();

     const hashPassword = await bcrypt.hash(password, salt);
     
     const payload = {
      ...rest,
      firstName,
      password: hashPassword,
      email,
      agentId: agent["id"]
     }

     const val = await this.usersRepository.create(payload, transaction);

     const userData = val.toJSON();

    await this.emailService.signUp({email, firstName});

    await this.agentService.createAgentReward(userData.id, transaction);

    const agentNotification: INotification = {
      agentId: agent.id,
      recipientType: "AGENT",
      title: "new user created",
      message: `a new user has successfully create an account with your referral link`
    }
    
    await this.auditTrailService.createNotification(agentNotification, transaction);

    const agentPayload = {
      email: agent["email"],
      firstName: agent["firstName"],
      fullName: `${firstName} ${data.lastName}`,
      userEmail: email
    }

    await this.emailService.agentReferral(agentPayload);
    
    const description = `New User: ${firstName} ${rest["lastName"]}`
 
    await this.auditTrailService.create({description}, transaction);

    const notification: INotification = {
      userId: userData.id,
      recipientType: "USER",
      title: "welcome to visarocraft",
      message: `welcome to visarocraft, ${firstName}`
    }

    
    await this.auditTrailService.createNotification(notification, transaction);

    return userData;
  }
  
   async create(data: CreateUserDto, transation: Transaction) {
     const { password, email, firstName, ...rest} = data;
     
     const user = await this.usersRepository.findOne({email});

     if(user) throw new BadRequestException("email already exist");

     const salt = await bcrypt.genSalt();

     const hashPassword = await bcrypt.hash(password, salt);
     
     const payload = {
      ...rest,
      firstName,
      password: hashPassword,
      email
     }

     const val = await this.usersRepository.create(payload, transation);

     const userData = val.toJSON();

    await this.emailService.signUp({email, firstName});

    const notification: INotification = {
      userId: userData.id,
      recipientType: "USER",
      title: "welcome to visarocraft",
      message: `welcome to visarocraft, ${firstName}`
    }
    
    await this.auditTrailService.createNotification(notification, transation);

    return userData;
  }

  async sendEmailVerficationOtp(data: SendOtpDto){
    const user = await this.usersRepository.findOne({email: data["email"]});

    if(!user) throw new BadRequestException("user does not exist");

    const code = helpers.generateOtp();

    await this.cacheStoreService.set(code, data.email);

    const payload = {
      email: data["email"],
      firstName: user["firstName"],
      code
    }

    await this.emailService.emailVerification(payload);
  }

  async VerifyEmail(data: EmailVerifyDto, transaction: Transaction){
    const { email, otp } = data;

    const userEmail = await this.cacheStoreService.get(otp);
    
    if (userEmail !== email) throw new BadRequestException('Invalid otp');

    return await this.usersRepository.update({email}, {isEmailVerified: true, isActivated: true}, transaction);
  }





  async forgotpassword(data: ForgetPasswordDto){
   const {email} = data;

   const user = await this.usersRepository.findOne({email});

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

    await this.usersRepository.update({email}, {password: hashPassword}, transaction);
  }

  async uploadCV(user: IUser, data: UploadCVDto, transaction: Transaction){
    const {cvUrl, cvPublicId} = data;

   return await this.usersRepository.update({email: user.email}, {cvUrl, cvPublicId}, transaction);
  }

  async findUser(user: IUser){
      const userdata = await this.usersRepository.findOne({email:user.email});

      const userDataJson = userdata.toJSON();

      return userDataJson;
  }

  async findUserById(userId: string){
    return await this.usersRepository.findOne({id: userId})
  }
  

  async getUserByEmail(email: string){
     return await this.usersRepository.findOne({email});
  }

  async updateProfile(user: IUser, data: UpdateUserDto, transaction: Transaction){
     return await this.usersRepository.update({id: user.id}, {...data}, transaction);
  }

  async findAllUsers(){

    const includeOption = {
      attributes: { exclude: ['password'] },
      include: [
          {
            model: PetitionModel,
            include: [
              {
                model: PetitionStageModel,
              }
            ]
          }
      ],

      order: [['createdAt', 'DESC']]
    }

    return await this.usersRepository.findAll({}, <unknown>includeOption);
  }
 
  async adminFindUser(id: string){
     const user = await this.usersRepository.findOne({id})
     
     return {
      ...user.toJSON()
     }
  }

  async updatePassword(user: IUser, data: changePasswordDto, transaction: Transaction){
    const {oldPassword, newPassword} = data;
  
    const userData = await this.usersRepository.findOne({id: user.id});
  
    const comparePassword = bcrypt.compareSync(oldPassword, userData.password);
  
    if (!comparePassword) throw new BadRequestException('your old password is incorrect');
  
    const salt = await bcrypt.genSalt();
  
    const hashPassword = await bcrypt.hash(newPassword, salt);
  
   const userJson = await this.usersRepository.update({id: user.id}, {password: hashPassword}, transaction);
  
   const notification: INotification = {
    userId: user.id,
    recipientType: "USER",
    title: "change password",
    message: `you have successfully changed your password`
  }
  
  await this.auditTrailService.createNotification(notification, transaction);

   return {
    ...userJson.toJSON()
   }
    
  }
}
