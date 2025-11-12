import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User } from 'src/common/decorators/user.decorator';
import { IUser } from '../users/interfaces/user.interface';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  
  @Get("user")
  @HttpCode(200)
  @ResponseMessage("user chat")
  async getChat(@User() user: IUser){
    return await this.chatService.fetchChat(user.id);
  }

  @Get("admin/:userId")
  @HttpCode(200)
  @ResponseMessage("user chat")
  async getAdminChat(@Param("userId") userId: string){
    return await this.chatService.fetchChat(userId);
  }
}
