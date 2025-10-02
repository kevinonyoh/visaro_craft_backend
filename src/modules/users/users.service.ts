import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, ForgetPasswordDto, ResetForgetPasswordDto, UploadCVDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { Transaction } from 'sequelize';
import * as bcrypt from "bcrypt";
import * as helpers from "src/common/utils/helper";
import { EmailService } from 'src/shared/notification/email/email.service';
import { CacheStoreService } from 'src/shared/cache-store/cache-store.service';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {

  constructor(
    private readonly usersRepository: UsersRepository, 
    private readonly emailService: EmailService,
    private readonly cacheStoreService: CacheStoreService
    ){}
  
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

    return userData;
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
  

  async getUserByEmail(email: string){
     return await this.usersRepository.findOne({email});
  }
 
}
