import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IPaymentType } from "../interface/payment.interface";
import { Transform } from "class-transformer";


export class CreatePaymentDto{}


export class CreatePaymentIntentDto{
   @IsString()
   @IsNotEmpty()
   petitionId: string;

   @IsEnum(IPaymentType)
   @IsNotEmpty()
   paymentOptionName: IPaymentType;

   @IsString()
   @IsNotEmpty()
   paymentOptionsId: string;
}

export class UpdatePaymentOptionDto{ 
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}