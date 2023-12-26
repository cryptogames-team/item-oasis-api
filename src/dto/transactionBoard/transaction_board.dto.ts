import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransactionBoardDTO {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'transaction_board_title'})
    transaction_board_title: string;

    // @IsNumber()
    @IsNotEmpty()
    @ApiProperty({description: 'game_id'})
    game_id: number;


    @IsNotEmpty()
    @ApiProperty({description: 'game_server_id'})
    game_server_id: number;


    @IsNotEmpty()
    @ApiProperty({description: 'transaction_board_type'})
    transaction_board_type: number;


    @IsNotEmpty()
    @ApiProperty({description: 'transaction_board_item_type'})
    transaction_board_item_type: number;

    @IsNotEmpty()
    @ApiProperty({description: 'transaction_board_sale_type'})
    transaction_board_sale_type: number;
    
    @IsNotEmpty()
    @ApiProperty({description: 'transaction_board_amount'})
    transaction_board_amount: number;


    @IsNotEmpty()
    @ApiProperty({description: 'transaction_board_min_amount'})
    transaction_board_min_amount: number;

 
    @IsNotEmpty()
    @ApiProperty({description: 'transaction_board_item_price'})
    transaction_board_item_price: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'transaction_board_detail'})
    transaction_board_detail: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'transaction_board_character_name'})
    transaction_board_character_name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'transaction_board_date'})
    transaction_board_date: string;

    @IsNotEmpty()
    @ApiProperty({description: 'transaction_completed'})
    transaction_completed: number;

    user_id: number;


}