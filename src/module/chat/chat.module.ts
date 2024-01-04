import { Module } from '@nestjs/common';
import { ChatController } from 'src/controller/chat/chat.controller';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { ChatGateway } from 'src/gateway/chat.gateway';
import { ChatRepository } from 'src/repository/chat/chat.repository';
import { ChatService } from 'src/service/chat/chat.service';

@Module({
  imports : [
    TypeOrmExModule.forCustomRepository([ChatRepository])
  ],
    providers: [ChatGateway, ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
