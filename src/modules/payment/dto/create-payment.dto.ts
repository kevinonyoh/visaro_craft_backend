import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IPaymentType } from "../interface/payment.interface";


export class CreatePaymentDto{}


export class CreatePaymentIntentDto{
    @IsNumber()
    @IsNotEmpty()
    paymentOptionId: number;
}

export class CreatePaymentOptionDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;
}