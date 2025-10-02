import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { IPaymentType } from "../interface/payment.interface";


export class CreatePaymentDto{}


export class CreatePaymentIntentDto{
    @IsEnum(IPaymentType)
    @IsNotEmpty()
    paymentType: IPaymentType;
}