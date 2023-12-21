import { CustomRepository } from "src/core/typeorm-ex.decorator";
import { ConflictException, InternalServerErrorException} from "@nestjs/common";
import { Repository } from "typeorm";
import { TransactionDetailImage } from "../../entity/transactionBoard/transaction_detail-image.entity";


@CustomRepository(TransactionDetailImage)
export class TransactionDetailImageRepository extends Repository<TransactionDetailImage> {

    async addDetailImage(transaction_board_id: number, transaction_detail_image: string): Promise<TransactionDetailImage> {
        
        const detail_image = this.create({transaction_board_id,transaction_detail_image});

        try{
            return await this.save(detail_image);
        }catch(error){
            throw new InternalServerErrorException();
        }
    }

    async getDetailImage(transaction_board_id: number): Promise<TransactionDetailImage[]> {
        const query = this.createQueryBuilder('transaction_detail_image')
                      .where('transaction_detail_image.transaction_board_id = :transaction_board_id', {transaction_board_id});
        
        return await query.getMany();
    }

    async removeDetailImageByTransactionBoardID(transaction_board_id: number) {
        await this.delete({transaction_board_id});
    }
   
}