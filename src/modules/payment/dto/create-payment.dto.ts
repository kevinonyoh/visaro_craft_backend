import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IPaymentType, IStatus } from "../interface/payment.interface";
import { Transform } from "class-transformer";


export class CreatePaymentDto{}


export class CreatePaymentIntentDto{
   @IsString()
   @IsNotEmpty()
   paymentOptionsId: string;
}

export class UpdatePaymentOptionDto{ 
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}


export class QueryPaymentDto{
   @IsEnum(IStatus)
   @IsOptional()
   status: IStatus;

   @IsEnum(IPaymentType)
   @IsOptional()
   paymentOptionName: IPaymentType;
}