import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../service/chat/chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private chatService: ChatService
  ){}

  @WebSocketServer()
  server: Server;

  connectedClients: { [socketId: string]: boolean } = {};
  clientNickname: { [socketId: string]: string } = {};

  handleConnection(client: Socket): void {

    this.connectedClients[client.id] = true;
  }

  handleDisconnect(client: Socket): void {
    delete this.connectedClients[client.id];
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, room: string): void {

  }

  @SubscribeMessage('exit')
  handleExit(client: Socket, room: string): void {

  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(
    client: Socket,
    data: { message: string; room: string },
  ): void {

  }
}
