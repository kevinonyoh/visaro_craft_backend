import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatMessagesModel } from './model/chat.model';
import { ChatMessagesRepository } from './repositories/chat.repository';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([ChatMessagesModel]), ConfigModule, JwtModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ChatMessagesRepository],
})
export class ChatModule {}
