import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto, JoinRoomDto } from "./dto/create-chat.dto";
import { ChatService } from "./chat.service";
import { TransactionParam } from "src/common/decorators/transaction-param.decorator";
import { Transaction } from "sequelize";

@WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService){}

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
      }
    
      handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
      }

      @SubscribeMessage('join_chat')
      handleJoinChat(@ConnectedSocket() client: Socket,@MessageBody() body: JoinRoomDto) {

        const roomName = `chat_${body.userId}_${body.adminId}`;
        
        client.join(roomName);
       
        console.log(`${client.id} joined room ${roomName}`);

        this.server.to(roomName).emit("joined_room", { message: `Joined room ${roomName}` });

        return;
      }

      @SubscribeMessage("send_message")
      async handleSendMessage(@MessageBody() body: CreateChatDto, @TransactionParam() transaction: Transaction){
        const roomName = `chat_${body.userId}_${body.adminId}`;
       
        const message = await this.chatService.sendMessage(body, transaction);

        this.server.to(roomName).emit("new_message", message);
      }

  }  