import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatMessagesRepository } from './repositories/chat.repository';
import { Transaction } from 'sequelize';

@Injectable()
export class ChatService {
   
  constructor(
    private readonly chatMessagesRepository: ChatMessagesRepository
   ){}

   async sendMessage(data: any, transaction: Transaction){
       return await this.chatMessagesRepository.create({...data}, transaction);
   }

   async fetchChat(userId: string){
      return await this.chatMessagesRepository.findAll({userId});
   }
}
