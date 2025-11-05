import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SenderType } from "../interface/chat.interface";

export class CreateChatDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    adminId: string; 

    @IsEnum(SenderType)
    @IsNotEmpty()
    senderType: SenderType;

    @IsString()
    @IsNotEmpty()
    message: string;
}

export class JoinRoomDto{
    @IsString()
    @IsNotEmpty()
    userId: string;
}
