import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator";


class AgentBankDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
  
    @IsString()
    @IsNotEmpty()
    accountNumber!: string;
  
    @IsString()
    @IsNotEmpty()
    accountName!: string;
  }

export class CreateAgentDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    pin: string;

    @ValidateNested()
    @Type(() => AgentBankDto)
    bank: AgentBankDto;

}



  export class ForgetPasswordDto{

    @IsEmail()
    @IsNotEmpty()
    email: string;

}

export class ResetForgetPasswordDto{

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}