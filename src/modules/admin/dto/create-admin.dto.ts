import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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
