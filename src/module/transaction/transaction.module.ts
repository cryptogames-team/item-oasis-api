import { Module } from '@nestjs/common';
import { TransactionController } from '../../controller/transaction/transaction.controller';
import { TransactionService } from '../../service/transaction/transaction.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { TransactionBoardRepository } from '../../repository/transactionBoard/transaction-board.repository';
import { UserModule } from '../user/user.module';
import { TransactionDetailImageRepository } from '../../repository/transactionBoard/transaction-detail-image.repository';
import { UserRepository } from 'src/repository/user/user.repository';
import { ChatRepository } from 'src/repository/chat/chat.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository,ChatRepository]),
    UserModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
