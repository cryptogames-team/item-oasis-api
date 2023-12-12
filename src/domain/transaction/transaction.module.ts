import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { TransactionBoardRepository } from './repositories/transaction-board.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TransactionBoardRepository]),
    UserModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
