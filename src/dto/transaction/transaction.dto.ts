import { ApiProperty } from "@nestjs/swagger";

export class TransactionDTO {

    @ApiProperty({description: '판매자'})
    seller: string;

    @ApiProperty({description: '구매자'})
    buyer: string;

    @ApiProperty({description: '거래 게시판 ID'})
    transaction_board_id: number;

    @ApiProperty({description: '가격'})
    price: string;

    date: number;

    @ApiProperty({description: '게임 id'})
    game_id: number;

    @ApiProperty({description: '구매 갯수'})
    item_count: number;

    @ApiProperty({description: '게임 서버'})
    game_server: number;

    @ApiProperty({description: '아이템 타입'})
    item_type: number;

    
}