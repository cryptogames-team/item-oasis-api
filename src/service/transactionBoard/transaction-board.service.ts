import { Injectable } from '@nestjs/common';
import { TransactionBoardRepository } from '../../repository/transactionBoard/transaction-board.repository';
import { TransactionDetailImageRepository } from '../../repository/transactionBoard/transaction-detail-image.repository';
import { TransactionBoardDTO } from '../../dto/transactionBoard/transaction_board.dto';
import { User } from 'src/entity/user/user.entity';
import { S3FolderName, mediaUpload } from 'src/utils/s3-util';
import { GetTransactionBoardByItemType } from '../../dto/transactionBoard/get_transaction_board.dto';
import { TransactionBoard } from '../../entity/transactionBoard/transaction-board.entity';

@Injectable()
export class TransactionBoardService {

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

    async removeTransactionBoardByID(transaction_board_id: number, user: User): Promise<string> {
        await this.transactionBoardRepository.isMyTransactionBoard(transaction_board_id, user.user_id);

        const detail_image = await this.transactionDetailImageRepository.getDetailImage(transaction_board_id);
        console.log(detail_image)
        if(detail_image){
            //S3상에서 삭제
            // const baseUrl = "https://crypto-games-s3.s3.ap-northeast-2.amazonaws.com/";

            // for(const image of detail_image){
            //     const { transaction_detail_image } = image;
            //     const image_key = transaction_detail_image.replace(new RegExp(baseUrl,'i'), '');
            //     console.log(image_key)
            //     deleteMedia(image_key);
            // }
            
            //db상에서 삭제

            await this.transactionDetailImageRepository.removeDetailImageByTransactionBoardID(transaction_board_id);
        }

        return this.transactionBoardRepository.removeTransactionBoardByID(transaction_board_id,user);
    }

    async updateTransactionBoardByID(transaction_board_id: number, transactionBoardDto: TransactionBoardDTO, user: User, files: Express.Multer.File[]): Promise<number> {
        this.transactionBoardRepository.isMyTransactionBoard(transaction_board_id,user.user_id);
        if(files){
            const detail_image = await this.transactionDetailImageRepository.getDetailImage(transaction_board_id);
            if(detail_image){
                await this.transactionDetailImageRepository.removeDetailImageByTransactionBoardID(transaction_board_id);
            }
            for(const file of files) {
                const url = await mediaUpload(file, S3FolderName.TransactionBoard);
                this.transactionDetailImageRepository.addDetailImage(transaction_board_id,url);
            }
        }
        return this.transactionBoardRepository.updateTransactionBoardByID(transaction_board_id,transactionBoardDto);
    }
}
