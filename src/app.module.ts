import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMconfig } from './config/typeorm.config';
import { LoggerMiddleware } from './utils/logger/logger.middleware';
import { TransactionModule } from './module/transaction/transaction.module';
import { TransactionBoardModule } from './module/transactionBoard/transaction-board.module';
import { GameModule } from './module/game/game.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisConfig } from './config/redis.config';
import { ChatGateway } from './gateway/chat.gateway';
import { ChatService } from './service/chat/chat.service';
import { ChatController } from './controller/chat/chat.controller';
import { ChatModule } from './module/chat/chat.module';
import { SearchModule } from './module/search/search.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RedisModule.forRoot({
      readyLog: true,
      config: RedisConfig
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeORMconfig),
    UserModule,
    TransactionModule,
    TransactionBoardModule,
    GameModule,
    ChatModule,
    SearchModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
