import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto, ForgetPasswordDto, ResetForgetPasswordDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminRepository } from './repositories/admin.repository';
import * as helpers from "src/common/utils/helper";
import * as bcrypt from "bcrypt";
import { EmailService } from 'src/shared/notification/email/email.service';
import { CacheStoreService } from 'src/shared/cache-store/cache-store.service';
import { Transaction } from 'sequelize';
import { IAdmin } from './interfaces/admin.interface';
import { UsersService } from '../users/users.service';
import { AgentTransactionRepository } from '../agent/repositories/Agent-transaction.repository';
import queryRunner from 'src/shared/database/raw-queries/query-runner';
import { IStatus } from '../payment/interface/payment.interface';
import { IAgentTransactionStatus } from '../agent/interfaces/agent.interface';
import { adminAgentQuery, adminDashboardQuery, adminPetitionQuery, adminUserQuery, adminfinancialQuery } from 'src/shared/database/raw-queries/scripts/admin-metric';

@Injectable()
export class AdminService {

  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly emailService: EmailService,
    private readonly cacheStoreService: CacheStoreService,
    private readonly usersService: UsersService
    ){}

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  async forgotpassword(data: ForgetPasswordDto){
    const {email} = data;
 
    const user = await this.adminRepository.findOne({email});
 
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
 
     await this.adminRepository.update({email}, {password: hashPassword}, transaction);
   }

   
  async findByEmail(email: string){
    return await this.adminRepository.findOne({email});
  }

  async findAdminProfile(admin: IAdmin){
    const data = await this.adminRepository.findOne({email: admin.email});

    const adminJson = data.toJSON();

    return adminJson;
  }

  async findAllUsers(){
     return await this.usersService.findAllUsers();
  }

  async findUser(id: string){
      return await this.usersService.adminFindUser(id);
  }

  async adminDashboardMetric(){
    const [result] = await queryRunner<any[]>(adminDashboardQuery, {
      successStatus: IStatus.SUCCESSFUL,
      approvedStatus: IAgentTransactionStatus.APPROVED, 
    });

    return {
      ...result
    }
 }

 async petitionMetric(){
  const [result] = await queryRunner<any[]>(adminPetitionQuery,{});

  return {
    ...result
  }
 }

 async userMetric(){
  const [result] = await queryRunner<any[]>(adminUserQuery, {});

  return {
    ...result
  }
 }

 async agentMetric(){
  const [result] = await queryRunner<any[]>(adminAgentQuery,{});

  return {
    ...result
  }
 }

 async financialMetric(){
   const [result] = await queryRunner<any[]>(adminfinancialQuery, {});

   return {
    ...result
   }
 }

 
 
}
