import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto{
    @IsString()
    @IsOptional()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsString()
    @IsOptional()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    countryCode: string;

    @IsString()
    @IsOptional()
    profilePicture: string;
}