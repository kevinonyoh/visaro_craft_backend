import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SenderType } from "../interface/chat.interface";

export class CreateChatDto {
    @IsString()
    @IsOptional()
    userId: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}

export class JoinRoomDto{
    @IsString()
    @IsOptional()
    userId: string;
}
