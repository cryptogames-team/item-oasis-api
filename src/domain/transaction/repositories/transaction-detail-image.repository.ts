import { CustomRepository } from "src/core/typeorm-ex.decorator";
import { ConflictException, InternalServerErrorException} from "@nestjs/common";
import { Repository } from "typeorm";
import { TransactionDetailImage } from "../entities/transaction_detail-image.entity";


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
   
}