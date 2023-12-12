import { Injectable } from '@nestjs/common';
import { TransactionBoardRepository } from './repositories/transaction-board.repository';
import { TransactionBoardDTO } from './dto/transaction_board.dto';
import { TransactionBoard } from './entities/transaction-board.entity';
import { User } from '../user/entities/user.entity';
import { GetTransactionBoardByItemType } from './dto/get_transaction_board.dto';
import { S3FolderName, mediaUpload } from 'src/utils/s3-util';
import { TransactionDetailImageRepository } from './repositories/transaction-detail-image.repository';

@Injectable()
export class TransactionService {
    constructor(
        private transactionBoardRepository: TransactionBoardRepository,
        private transactionDetailImageRepository: TransactionDetailImageRepository
    ){}

    async createTransactionBoard(transactionBoardDTO: TransactionBoardDTO, user: User, files: Express.Multer.File[]): Promise<TransactionBoard> {
        const { user_id } = user;

        transactionBoardDTO.user_id = user_id;

        const board = await this.transactionBoardRepository.createTransactionBoard(transactionBoardDTO);

        if(files){
            for(const file of files) {
                const url = await mediaUpload(file, S3FolderName.TransactionBoard);
                this.transactionDetailImageRepository.addDetailImage(board.transaction_board_id,url);
            }
        }

        return this.transactionBoardRepository.getTransactionBoardByID(board.transaction_board_id);
    }

    getTransactionBoard(params: GetTransactionBoardByItemType): Promise<{board: TransactionBoard[] , count: number}> {
        return this.transactionBoardRepository.getTransactionBoard(params);
    }

    getTransactionBoardByID(transaction_board_id: number): Promise<TransactionBoard> {
        return this.transactionBoardRepository.getTransactionBoardByID(transaction_board_id);
    }

    removeTransactionBoardByID(transaction_board_id: number, user: User): Promise<string> {
        return this.transactionBoardRepository.removeTransactionBoardByID(transaction_board_id,user);
    }
}
