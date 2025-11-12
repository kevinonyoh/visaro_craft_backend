import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { CreateChatDto, JoinRoomDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { TransactionParam } from 'src/common/decorators/transaction-param.decorator';
import { Transaction } from 'sequelize';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
    
      const token = client.handshake.auth?.token?.replace(/(Bearer\s|bearer\s)/, '') || client.handshake.headers.authorization?.replace(/(Bearer\s|bearer\s)/, '');

      if (!token) throw new UnauthorizedException('Token missing');

      const clientType = client.handshake.auth?.client || client.handshake.headers['client'];

      if (!clientType || (clientType !== 'USER' && clientType !== 'ADMIN')) {
        throw new UnauthorizedException('Invalid client type');
      }

      let decoded;

      if (clientType === 'USER') {

        decoded = this.jwtService.verify(token, {
          secret: this.configService.get('secretKey'),
        });

        client.data.role = 'user';

        client.data.user = decoded;

      } 
      
      if (clientType === 'ADMIN') {

        decoded = this.jwtService.verify(token, {
          secret: this.configService.get('adminSecretKey'),
        });
        
        client.data.role = 'admin';

        client.data.admin = decoded;
      }

      console.log(`${client.data.role} connected: ${client.id}`);

    } catch (err) {
      console.log('Unauthorized socket:', err.message);
     
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(@ConnectedSocket() client: Socket, @MessageBody() body: JoinRoomDto){
  
    const room = client.data.role === 'admin' ? `chat_${body.userId}`: `chat_${client.data?.user.id}`;

    client.join(room);

    console.log(`${client.id} joined room ${room}`);

    this.server.to(room).emit("joined_room", { message: `Joined room ${room}` });

    return;
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() body: CreateChatDto, @TransactionParam() transaction: Transaction) {

    const userId = client.data.role === 'admin' ? body.userId : client.data?.user.id;

    const room = `chat_${userId}`;

    const senderType = client.data.role === 'admin' ? 'admin' : 'user';

    const msgObj = {
      senderType,
      message: body.message,
      userId
    };

   const message = await this.chatService.sendMessage(msgObj, transaction);

    this.server.to(room).emit('new_message', message);
  }
}
