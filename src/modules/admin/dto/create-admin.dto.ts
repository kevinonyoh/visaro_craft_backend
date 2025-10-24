import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { IAgentTransactionStatus } from "src/modules/agent/interfaces/agent.interface";

export class CreateAdminDto {}

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

