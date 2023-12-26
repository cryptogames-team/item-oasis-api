import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMconfig } from './config/typeorm.config';
import { LoggerMiddleware } from './utils/logger/logger.middleware';
import { TransactionModule } from './module/transaction/transaction.module';
import { TransactionBoardModule } from './module/transactionBoard/transaction-board.module';
import { GameModule } from './module/game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeORMconfig),
    UserModule,
    TransactionModule,
    TransactionBoardModule,
    GameModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
