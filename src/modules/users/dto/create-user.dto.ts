import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {

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
    password: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    countryCode: string;
}

export class AgentQueryDto{
    @IsString()
    @IsOptional()
    agentId?: string;
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

export class UploadCVDto{

    @IsString()
    @IsNotEmpty()
    cvUrl: string;

    @IsString()
    @IsNotEmpty()
    cvPublicId: string;
    
}


