import { CustomRepository } from "src/core/typeorm-ex.decorator";
import { TransactionBoard } from "../entities/transaction-board.entity";
import { Repository } from "typeorm";
import { TransactionBoardDTO } from "../dto/transaction_board.dto";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { User } from "src/domain/user/entities/user.entity";
import { GetTransactionBoardByItemType } from "../dto/get_transaction_board.dto";

@CustomRepository(TransactionBoard)
export class TransactionBoardRepository extends Repository<TransactionBoard> {

    //거래 게시판 작성
    async createTransactionBoard(transactionBoardDTO: TransactionBoardDTO): Promise<TransactionBoard> {
        const board = this.create(transactionBoardDTO);

        try {
            await this.save(board);
            return board;
        }catch(error){
            throw new InternalServerErrorException();
        }
    }

    async getTransactionBoard(params: GetTransactionBoardByItemType): Promise<{board: TransactionBoard[] , count: number}> {
        const { transaction_board_game, transaction_board_server, 
                transaction_board_type, transaction_board_item_type, limit, filter, page } = params;
  
        const query = this.createQueryBuilder('transaction_board');

        query.select([
            'transaction_board.transaction_board_id',
            'transaction_board.transaction_board_title',
            'transaction_board.transaction_board_min_amount',
            'transaction_board.transaction_board_amount',
            'transaction_board.transaction_board_item_price',
            'transaction_board.transaction_board_date',
            'transaction_board.user_id'
        ]).leftJoinAndSelect('transaction_board.user_id', 'user');

        if (transaction_board_game) {
            query.andWhere('transaction_board.transaction_board_game = :transaction_board_game', { transaction_board_game });
        }
        if (transaction_board_server) {
            query.andWhere('transaction_board.transaction_board_server = :transaction_board_server', { transaction_board_server });
        }
        if (transaction_board_type) {
            query.andWhere('transaction_board.transaction_board_type = :transaction_board_type', { transaction_board_type });
        }
        if (transaction_board_item_type) {
            query.andWhere('transaction_board.transaction_board_item_type = :transaction_board_item_type', { transaction_board_item_type });
        }

        if(filter){

            if(filter === '0'){
                query.orderBy('transaction_board.transaction_board_id', 'DESC');                
            }
            
            if(filter === '1'){
                query.orderBy('transaction_board.transaction_board_item_price', 'DESC');                
            }

            if(filter === '2'){
                query.orderBy('transaction_board.transaction_board_item_price', 'ASC');
            }

            if(filter === '3'){
                query.orderBy('transaction_board.transaction_board_amount', 'DESC');
            }
        }else {
            query.orderBy('transaction_board.transaction_board_id', 'DESC');
        }

        const count = await query.getCount();

        const skip = (page - 1) * limit;
        query.skip(skip).take(limit);

        const board = await query.getMany();

        return {board , count};
    }

    async getTransactionBoardByID(transaction_board_id: number): Promise<TransactionBoard> {

        const query = this.createQueryBuilder('transaction_board');

        query.leftJoinAndSelect('transaction_board.user_id', 'user');

        query.andWhere('transaction_board.transaction_board_id = :transaction_board_id', { transaction_board_id });

        const found = await query.getOne();

        if(!found){
            throw new NotFoundException(`Can't found transaction board by ${transaction_board_id}`);
        }

        return found;
    }
}