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

@Injectable()
export class AdminService {

  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly emailService: EmailService,
    private readonly cacheStoreService: CacheStoreService){}

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
}
