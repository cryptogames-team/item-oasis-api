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
}