import { Module } from '@nestjs/common';
import { TransactionBoardController } from '../../controller/transactionBoard/transaction-board.controller';
import { TransactionBoardService } from '../../service/transactionBoard/transaction-board.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { TransactionBoardRepository } from '../../repository/transactionBoard/transaction-board.repository';
import { TransactionDetailImageRepository } from '../../repository/transactionBoard/transaction-detail-image.repository';
import { UserModule } from 'src/module/user/user.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TransactionBoardRepository,TransactionDetailImageRepository]),
    UserModule
  ],
  controllers: [TransactionBoardController],
  providers: [TransactionBoardService]
})
export class TransactionBoardModule {}
