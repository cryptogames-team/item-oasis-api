import { Body, Controller, Post, Get, Delete, Patch, ValidationPipe, Param, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionBoardDTO } from './dto/transaction_board.dto';
import { TransactionBoard } from './entities/transaction-board.entity';
import UseAuthGuard from '../user/auth-guards/use-auth';
import AuthUser from 'src/core/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import { GetTransactionBoardByItemType } from './dto/get_transaction_board.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { TransactionBoardAndUser, TransactionBoardArrayAndUser } from './swaggerType/getBoard.type';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TransactionDetailImage } from './entities/transaction_detail-image.entity';

@ApiTags('트랜잭션 API')
@Controller('transaction')
export class TransactionController {
    constructor(
        private transactionService: TransactionService
    ){}

    @UseAuthGuard()
    @Post('/')
    @UseInterceptors(FilesInterceptor('file',3))
    @ApiOperation({summary: '거래 게시판 만들기', description: '엑세스토큰 포함시킬것'})
    @ApiCreatedResponse({description:'transaction_detail_image 이거 배열로 갈거임', type: TransactionBoardAndUser})
    createTransactionBoard(
        @UploadedFiles()files: Express.Multer.File[],
        @Body(ValidationPipe)transactionBoardDTO: TransactionBoardDTO,
        @AuthUser()user: User): Promise<TransactionBoard> {
        return this.transactionService.createTransactionBoard(transactionBoardDTO,user,files);
    }

    @Get('/')
    @ApiOperation({summary: '거래 게시글 목록 가져오기(필터링)', description: '설명이 필요하겠노'})
    @ApiCreatedResponse({description:'배열로 보낼거임', type: [TransactionBoardArrayAndUser]})
    getTransactionBoard(
        @Query() params: GetTransactionBoardByItemType
    ): Promise<{board: TransactionBoard[] , count: number}> {
        return this.transactionService.getTransactionBoard(params);
    }

    @Get('/transactionBoard/:transaction_board_id')
    @ApiOperation({summary: '특정 거래 게시글 불러오기', description: '게시글 ID값으로 보낼 것'})
    @ApiCreatedResponse({description:'transaction_detail_image 이거 배열로 갈거임', type: TransactionBoardAndUser})
    getTransactionBoardByID(
        @Param('transaction_board_id')transaction_board_id: number
    ): Promise<TransactionBoard> {
        return this.transactionService.getTransactionBoardByID(transaction_board_id);
    }

    @UseAuthGuard()
    @Delete('/:transaction_board_id')
    @ApiOperation({summary: '특정 거래 게시글 삭제', description: '게시글 ID값으로 보낼 것'})
    @ApiCreatedResponse({description:'오류 없으면 delete success가 보내질거임 json형식 아님'})
    removeTransactionBoardByID(
        @Param('transaction_board_id')transaction_board_id: number,
        @AuthUser()user: User
    ): Promise<string> {
        return this.transactionService.removeTransactionBoardByID(transaction_board_id,user);
    }
    
    @UseAuthGuard()
    @Patch('/:transaction_board_id')
    @ApiOperation({summary: '특정 거래 게시글 수정', description: '게시글 ID값은 param으로 게시글 내용은 body에 담을 것'})
    @ApiCreatedResponse({description:'오류 없으면 게시글 ID값이 보내질거임 json형식 아님'})
    updateTransactionBoardByID(
        @AuthUser()user: User,
        @Param('transaction_board_id')transaction_board_id: number,
        @Body()transactionBoardDto: TransactionBoardDTO
    ): Promise<number> {
        return this.transactionService.updateTransactionBoardByID(transaction_board_id,transactionBoardDto,user);
    }
}
