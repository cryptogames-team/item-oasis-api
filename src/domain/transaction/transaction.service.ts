import { Injectable } from '@nestjs/common';
import { TransactionBoardRepository } from './repositories/transaction-board.repository';
import { TransactionBoardDTO } from './dto/transaction_board.dto';
import { TransactionBoard } from './entities/transaction-board.entity';
import { User } from '../user/entities/user.entity';
import { GetTransactionBoardByItemType } from './dto/get_transaction_board.dto';

@Injectable()
export class TransactionService {
    constructor(
        private transactionBoardRepository: TransactionBoardRepository
    ){}

    createTransactionBoard(transactionBoardDTO: TransactionBoardDTO, user: User): Promise<TransactionBoard> {
        const { user_id } = user;

        transactionBoardDTO.user_id = user_id;

        return this.transactionBoardRepository.createTransactionBoard(transactionBoardDTO);
    }

    getTransactionBoard(params: GetTransactionBoardByItemType): Promise<{board: TransactionBoard[] , count: number}> {
        return this.transactionBoardRepository.getTransactionBoard(params);
    }

    getTransactionBoardByID(transaction_board_id: number): Promise<TransactionBoard> {
        return this.transactionBoardRepository.getTransactionBoardByID(transaction_board_id);
    }
}
