import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";



export class GetTransactionBoardByItemType {

    @IsString()
    @ApiProperty({description: '검색어',required : false})
    transaction_board_title: string;

    @IsNumber()
    @ApiProperty({description: '게임의 ID값',required : false})
    game_id: number;

    @IsNumber()
    @ApiProperty({description: '게임 서버의 ID값',required : false})
    game_server_id: number;

    @IsNumber()
    @ApiProperty({description: '판매글 : 0, 구매글 : 1',required : false})
    transaction_board_type: number;

    @IsNumber()
    @ApiProperty({description: '게임머니 : 0, 게임 아이템 : 1, 게임 계정 : 2',required : false})
    transaction_board_item_type: number;

    @IsNumber()
    @ApiProperty({description: '가져오는 게시글 제한 수',required : false})
    limit: number;

    @IsString()
    @ApiProperty({description: '최신순 : 0, 가격 높은 순 : 1, 가격 낮은 순 : 2, 보유 수량 높은 순 : 3',required : false})
    filter: string;

    @IsNumber()
    @ApiProperty({description: '현재 페이지',required : false})
    page: number;

    @IsNumber()
    @ApiProperty({description: '판매 상태',required : false})
    transaction_completed: number;
}