import { Body, Controller, Post, Get, ValidationPipe, Param, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionBoardDTO } from './dto/transaction_board.dto';
import { TransactionBoard } from './entities/transaction-board.entity';
import UseAuthGuard from '../user/auth-guards/use-auth';
import AuthUser from 'src/core/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import { GetTransactionBoardByItemType } from './dto/get_transaction_board.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { TransactionBoardAndUser, TransactionBoardArrayAndUser } from './swaggerType/getBoard.type';

@ApiTags('트랜잭션 API')
@Controller('transaction')
export class TransactionController {
    constructor(
        private transactionService: TransactionService
    ){}

    @UseAuthGuard()
    @Post('/')
    @ApiOperation({summary: '거래 게시판 만들기', description: '엑세스토큰 포함시킬것'})
    @ApiCreatedResponse({description:'게시판 보내줌', type: TransactionBoard})
    createTransactionBoard(
        @Body(ValidationPipe)transactionBoardDTO: TransactionBoardDTO,
        @AuthUser()user: User): Promise<TransactionBoard> {
        return this.transactionService.createTransactionBoard(transactionBoardDTO,user);
    }

    @Get('/')
    @ApiOperation({summary: '거래 게시글 목록 가져오기(필터링)', description: '설명이 필요하겠노'})
    @ApiCreatedResponse({description:'응답 예시는 게시글 하나인데 배열로 보내질거임', type: TransactionBoardArrayAndUser})
    getTransactionBoard(
        @Query() params: GetTransactionBoardByItemType
    ): Promise<{board: TransactionBoard[] , count: number}> {
        return this.transactionService.getTransactionBoard(params);
    }

    @Get('/transactionBoard/:transaction_board_id')
    @ApiOperation({summary: '특정 거래 게시글 불러오기', description: '게시글 ID값으로 보낼 것'})
    @ApiCreatedResponse({description:'게시글 보내줌', type: TransactionBoardAndUser})
    getTransactionBoardByID(
        @Param('transaction_board_id')transaction_board_id: number
    ): Promise<TransactionBoard> {
        return this.transactionService.getTransactionBoardByID(transaction_board_id);
    }

}
