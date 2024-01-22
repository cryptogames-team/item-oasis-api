import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../service/chat/chat.service';
import DateUtils from 'src/utils/date-util';
import { ChatDTO } from 'src/dto/chat/chat.dto';

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["authorization", "Authorization"],
    credentials: true,
  }
})
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
    console.log("소켓 연결", client.id);
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

    this.clientuserid[client.id] = user_id;
    this.clientids[user_id] = client.id;
  }

  //채팅방 들어갈 때
  @SubscribeMessage('join')
  async handleJoin(client: Socket, room: string): Promise<void> {
    if(client.rooms.has(room)){
      return;
    }

    client.join(room);
    
    if (!this.roomUsers[room]) {
      this.roomUsers[room] = [];
    }
    this.roomUsers[room].push(this.clientuserid[client.id]);
    console.log("room 유저 ", this.roomUsers[room]);
    //방에 접속하면 방에 있는 유저들에게 방 접속 리스트를 보냄
    //보내는 이유는 만약 방에 상대방이 접속해 있으면 내가 보낸 메시지의 읽음은 0이 되게 프론트 작업하면 됨
    //상대방이 접속할 때 마다 db에서 불러올 수는 없으니까
    //서버에서는 따로 처리하니 상관 ㄴ
    this.server.to(room).emit('joinRoom',this.roomUsers[room]);
    await this.chatService.readMessage(room,this.clientuserid[client.id]);
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
    //방에서 나가면 방에 있는 유저들에게 방 접속 리스트를 보냄
    //이때부턴 읽음 처리 안되고 프론트에서는 읽음 1로 처리하면 됨
    this.server.to(room).emit('exitRoom',this.roomUsers[room]);
  }

  //채팅
  @SubscribeMessage('chatMessage')
  async handleChatMessage(
    client: Socket, data : {chatDTO: ChatDTO, recieverId: number }

  ): Promise<void> {
    const { chatDTO, recieverId } = data;
    const { chat_room } = chatDTO;
    console.log("chat room",chat_room) 
    const index = this.roomUsers[chat_room]?.indexOf(recieverId.toString());
    const date = DateUtils.momentNow();
    data.chatDTO.chat_date = date.toString();
    if(index !== -1){
      //룸으로 소켓통신
      data.chatDTO.is_read = 1;
      const chat = await this.chatService.addChat(data.chatDTO);
      this.server.to(chat_room).emit('roomChatMessage',chat);
      return;
    }
    data.chatDTO.is_read = 0;
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
