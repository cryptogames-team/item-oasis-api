import { Module } from '@nestjs/common';
import { ChatController } from 'src/controller/chat/chat.controller';
import { ChatGateway } from 'src/gateway/chat.gateway';
import { ChatService } from 'src/service/chat/chat.service';

@Module({
    providers: [ChatGateway, ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
