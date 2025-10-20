import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto{
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    countryCode: string;

    @IsString()
    @IsNotEmpty()
    profilePicture: string;
}