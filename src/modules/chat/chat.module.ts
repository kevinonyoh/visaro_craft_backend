import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatMessagesModel } from './model/chat.model';
import { ChatMessagesRepository } from './repositories/chat.repository';

@Module({
  imports: [SequelizeModule.forFeature([ChatMessagesModel])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ChatMessagesRepository],
})
export class ChatModule {}
