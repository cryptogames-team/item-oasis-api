import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../service/chat/chat.service';
import DateUtils from 'src/utils/date-util';
import { ChatDTO } from 'src/dto/chat/chat.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private chatService: ChatService
  ){}

  @WebSocketServer()
  server: Server;

  connectedClients: { [socketId: string]: boolean } = {};
  clientuserid: { [socketId: string]: number } = {};
  clientids: {[name: string]: string } = {};
  roomUsers: { [key: number]: number[] } = {};

  handleConnection(client: Socket): void {

    this.connectedClients[client.id] = true;
  }

  handleDisconnect(client: Socket): void {
    delete this.connectedClients[client.id];

    Object.keys(this.roomUsers).forEach((room) => {
      const index = this.roomUsers[room]?.indexOf(
        this.clientuserid[client.id],
      );
      if (index !== -1) {
        this.roomUsers[room].splice(index, 1);
        client.leave(room);
      }
    });
  }

  //최초 연결 시 보내셈
  @SubscribeMessage('set_user_id')
  setName(client: Socket, user_id: number): void {
    console.log(user_id)
    this.clientuserid[client.id] = user_id;
    this.clientids[user_id] = client.id;
  }

  //채팅방 들어갈 때
  @SubscribeMessage('join')
  handleJoin(client: Socket, room: string): void {
    if(client.rooms.has(room)){
      return;
    }
    console.log(room)
    client.join(room);

    if (!this.roomUsers[room]) {
      this.roomUsers[room] = [];
    }
    this.roomUsers[room].push(this.clientuserid[client.id]);
  }

  //채팅방 나갈 때
  @SubscribeMessage('exit')
  handleExit(client: Socket, room: string): void {
    if (!client.rooms.has(room)) {
      return;
    }
    client.leave(room);
    const index = this.roomUsers[room]?.indexOf(this.clientuserid[client.id]);
    if (index !== -1) {
      this.roomUsers[room].splice(index, 1);
    }

  }

  //채팅
  @SubscribeMessage('chatMessage')
  async handleChatMessage(
    client: Socket, data : {chatDTO: ChatDTO, recieverId: number }

  ): Promise<void> {
    const { chatDTO, recieverId } = data;
    console.log(data)
    const { chat_room } = chatDTO;
    const index = this.roomUsers[chat_room]?.indexOf(recieverId.toString());
    const date = DateUtils.momentNow();
    if(index !== -1){
      //룸으로 소켓통신
      data.chatDTO.chat_date = date.toString();
      const chat = await this.chatService.addChat(data.chatDTO);
      console.log("룸 이름",data.chatDTO.chat_room)
      this.server.to(chat_room).emit('roomChatMessage',chat);
      return;
    }

    const recieverSocketId = this.clientids[recieverId];
    if(this.connectedClients[recieverSocketId]){
      //소켓 아이디로 통신
      const chat = await this.chatService.addChat(data.chatDTO);
      this.server.to(recieverSocketId).emit('chatMessage',chat);
      this.server.to(client.id).emit('roomChatMessage',chat);
      return;
    }

    //접속중이 아니니 그냥 db에 저장
    const chat = await this.chatService.addChat(data.chatDTO);
    this.server.to(client.id).emit('roomChatMessage',chat);
  }
}
