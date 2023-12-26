import { User } from "../../entity/user/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionDetailImage } from "../../entity/transactionBoard/transaction_detail-image.entity";
import { GameInfo } from "src/entity/game/game.entity";
import { GameServer } from "src/entity/game/game-server.entity";

export class TransactionBoardArrayAndUser {

    @ApiProperty({description: 'transaction_board_id'})
    transaction_board_id: number;

    @ApiProperty({description: 'transaction_board_title'})
    transaction_board_title: string;

    @ApiProperty({description: 'transaction_board_amount'})
    transaction_board_amount: number;

    @ApiProperty({description: 'transaction_board_min_amount'})
    transaction_board_min_amount: number;

    @ApiProperty({description: 'transaction_board_item_price'})
    transaction_board_item_price: number;

    @ApiProperty({description: 'transaction_board_date'})
    transaction_board_date: string;

    @ApiProperty({description: '유저'})
    user: User;

    @ApiProperty({description: 'transaction_board_sale_type'})
    transaction_board_sale_type: number;

    @ApiProperty({description: 'game'})
    game_id: GameInfo;

    @ApiProperty({description: 'game_server'})
    game_server_id: GameServer;
}

export class TransactionBoardAndUser extends TransactionBoardArrayAndUser{


    @ApiProperty({description: 'transaction_board_type'})
    transaction_board_type: number;

    @ApiProperty({description: 'transaction_board_item_type'})
    transaction_board_item_type: number;

    @ApiProperty({description: 'transaction_board_detail'})
    transaction_board_detail: string;

    @ApiProperty({description: 'transaction_board_character_name'})
    transaction_board_character_name: string;

    @ApiProperty({description: 'transaction_detail_image'})
    transaction_detail_image: TransactionDetailImage;
}

  