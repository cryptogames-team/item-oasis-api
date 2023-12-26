import { CustomRepository } from "src/core/typeorm-ex.decorator";
import { TransactionBoard } from "../../entity/transactionBoard/transaction-board.entity";
import { Repository } from "typeorm";
import { TransactionBoardDTO } from "../../dto/transactionBoard/transaction_board.dto";
import { ForbiddenException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { GetTransactionBoardByItemType } from "../../dto/transactionBoard/get_transaction_board.dto";
import { User } from "src/entity/user/user.entity";

@CustomRepository(TransactionBoard)
export class TransactionBoardRepository extends Repository<TransactionBoard> {

    //거래 게시판 작성
    async createTransactionBoard(transactionBoardDTO: TransactionBoardDTO): Promise<TransactionBoard> {
        const board = this.create(transactionBoardDTO);

        try {
            await this.save(board);
            const final_board = await this.getTransactionBoardByID(board.transaction_board_id);
            return final_board;
        }catch(error){
            console.log(error)
            throw new InternalServerErrorException();
        }
    }

    async getTransactionBoard(params: GetTransactionBoardByItemType): Promise<{board: TransactionBoard[] , count: number}> {
        const { game_id, game_server_id, transaction_board_title,
                transaction_board_type, transaction_board_item_type, limit, filter, page } = params;
  
        const query = this.createQueryBuilder('transaction_board');

        query.select([
            'transaction_board.transaction_board_id',
            'transaction_board.transaction_board_title',
            'transaction_board.transaction_board_min_amount',
            'transaction_board.transaction_board_amount',
            'transaction_board.transaction_board_item_price',
            'transaction_board.transaction_board_date',
            'transaction_board.user_id',
            'transaction_board.transaction_board_item_type',
            'transaction_board.transaction_board_sale_type'
        ]).leftJoinAndSelect('transaction_board.user_id', 'user')
        .leftJoinAndSelect('transaction_board.game_id','game')
        .leftJoinAndSelect('transaction_board.game_server_id','game_server');
        
        if(transaction_board_title){
            query.andWhere('transaction_board.transaction_board_title LIKE :title',  {title: `%${transaction_board_title}%`});
        }

        if (game_id) {
            query.andWhere('transaction_board.game_id = :game_id', { game_id });
        }
        if (game_server_id) {
            query.andWhere('transaction_board.game_server_id = :game_server_id', { game_server_id });
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

        query.leftJoinAndSelect('transaction_board.transaction_detail_image', 'transaction_detail_image');

        query.leftJoinAndSelect('transaction_board.game_id','game')
        .leftJoinAndSelect('transaction_board.game_server_id','game_server');

        query.andWhere('transaction_board.transaction_board_id = :transaction_board_id', { transaction_board_id });

        const found = await query.getOne();

        if(!found){
            throw new NotFoundException(`Can't found transaction board by ${transaction_board_id}`);
        }

        return found;
    }

    async getTransactionBoardByName(user_name: string): Promise<TransactionBoard[]> {
        const query = this.createQueryBuilder('transaction_board');

        query.select([
            'transaction_board.transaction_board_id',
            'transaction_board.transaction_board_title',
            'transaction_board.transaction_board_min_amount',
            'transaction_board.transaction_board_amount',
            'transaction_board.transaction_board_item_price',
            'transaction_board.transaction_board_date',
            'transaction_board.user_id',
            'transaction_board.transaction_board_item_type',
            'transaction_board.transaction_board_sale_type'
        ])
        .leftJoinAndSelect('transaction_board.user_id', 'user')
        .leftJoinAndSelect('transaction_board.game_id','game')
        .leftJoinAndSelect('transaction_board.game_server_id','game_server')
        .andWhere('user.user_name = :user_name', { user_name });

        return await query.getMany()
    }

    async isMyTransactionBoard(transaction_board_id: number, user_id: number) {
        await this.getTransactionBoardByID(transaction_board_id);

        const found = await this.findOne({
            where : {
                user_id,
                transaction_board_id
            }
        });

        if(!found){
            throw new ForbiddenException(`transaction_board_id : ${transaction_board_id} isn't your transaction board`);
        }
    }
    async removeTransactionBoardByID(transaction_board_id: number, user: User): Promise<string> {

        await this.delete({transaction_board_id});

        return 'delete success';
    }

    async updateTransactionBoardByID(transaction_board_id: number, transaction_board: TransactionBoardDTO): Promise<number> {
        await this.update(transaction_board_id, transaction_board);
        return transaction_board_id;
    }

    async updateTransactionCompleted(transaction_board_id: number, transaction_completed: number): Promise<number> {
        await this.createQueryBuilder()
            .update(TransactionBoard)
            .set({ transaction_completed: transaction_completed })
            .where('transaction_board_id = :id', { id: transaction_board_id })
            .execute();
        return transaction_board_id;
    }
}