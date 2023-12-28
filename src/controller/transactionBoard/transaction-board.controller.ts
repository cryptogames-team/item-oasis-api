import { Body, Controller, Post, Patch, Get, Delete, ValidationPipe, Param, Query, UseInterceptors, UploadedFiles, Put } from '@nestjs/common';
import { TransactionBoardService } from '../../service/transactionBoard/transaction-board.service';
import UseAuthGuard from 'src/auth-guards/use-auth';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransactionBoardAndUser, TransactionBoardArrayAndUser } from '../../swaggerType/transactionBoard/getBoard.type';
import AuthUser from 'src/core/auth-user.decorator';
import { TransactionBoardDTO } from '../../dto/transactionBoard/transaction_board.dto';
import { User } from 'src/entity/user/user.entity';
import { TransactionBoard } from '../../entity/transactionBoard/transaction-board.entity';
import { GetTransactionBoardByItemType } from '../../dto/transactionBoard/get_transaction_board.dto';

@ApiTags('거래 게시판 API')
@Controller('transaction-board')
export class TransactionBoardController {

    constructor(
        private transactionBoardService: TransactionBoardService
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
        return this.transactionBoardService.createTransactionBoard(transactionBoardDTO,user,files);
    }

    @Get('/all')
    @ApiOperation({summary: '거래 게시글 목록 가져오기(필터링)', description: '설명이 필요하겠노'})
    @ApiCreatedResponse({description:'배열로 보낼거임', type: [TransactionBoardArrayAndUser]})
    getTransactionBoard(
        @Query() params: GetTransactionBoardByItemType
    ): Promise<{board: TransactionBoard[] , count: number}> {
        return this.transactionBoardService.getTransactionBoard(params);
    }

    @Get('/:transaction_board_id')
    @ApiOperation({summary: '특정 거래 게시글 불러오기', description: '게시글 ID값으로 보낼 것'})
    @ApiCreatedResponse({description:'transaction_detail_image 이거 배열로 갈거임', type: TransactionBoardAndUser})
    getTransactionBoardByID(
        @Param('transaction_board_id')transaction_board_id: number
    ): Promise<TransactionBoard> {
        return this.transactionBoardService.getTransactionBoardByID(transaction_board_id);
    }

    // @Get('/user/:user_name')
    // @ApiOperation({summary: '유저 거래 게시글 목록 가져오기', description: '설명이 필요하겠노'})
    // @ApiCreatedResponse({description:'배열로 보낼거임', type: [TransactionBoardArrayAndUser]})
    // getTransactionBoardByName(
    //     @Param('user_name')user_name: string
    // ):Promise<TransactionBoard[]> {
    //     return this.transactionBoardService.getTransactionBoardByName(user_name);
    // }

    @UseAuthGuard()
    @Delete('/select')
    @ApiOperation({summary: '선택한 거래 게시글들 삭제', description: `{ "transaction_board_ids" : [아이디들] }`})
    @ApiCreatedResponse({description:'오류 없으면 success가 보내질거임 json형식 아님'})
    async removeTransactionBoardBySelect(
        @Body() body: { transaction_board_ids: number[] },
        @AuthUser()user: User
    ) {
        const { transaction_board_ids } = body;
        for (const transaction_board_id of transaction_board_ids) {
            await this.transactionBoardService.removeTransactionBoardByID(transaction_board_id, user);
        }

        return 'success';

    }

    @UseAuthGuard()
    @Delete('/:transaction_board_id')
    @ApiOperation({summary: '특정 거래 게시글 삭제', description: '게시글 ID값으로 보낼 것'})
    @ApiCreatedResponse({description:'오류 없으면 delete success가 보내질거임 json형식 아님'})
    removeTransactionBoardByID(
        @Param('transaction_board_id')transaction_board_id: number,
        @AuthUser()user: User
    ): Promise<string> {
        return this.transactionBoardService.removeTransactionBoardByID(transaction_board_id,user);
    }


    
    @UseAuthGuard()
    @Put('/:transaction_board_id')
    @UseInterceptors(FilesInterceptor('file',3))
    @ApiOperation({summary: '특정 거래 게시글 수정', description: '게시글 ID값은 param으로 게시글 내용은 body에 담을 것'})
    @ApiCreatedResponse({description:'오류 없으면 게시글 ID값이 보내질거임 json형식 아님'})
    updateTransactionBoardByID(
        @UploadedFiles()files: Express.Multer.File[],
        @AuthUser()user: User,
        @Param('transaction_board_id')transaction_board_id: number,
        @Body()transactionBoardDto: TransactionBoardDTO
    ): Promise<number> {
        return this.transactionBoardService.updateTransactionBoardByID(transaction_board_id,transactionBoardDto,user,files);
    }

    @UseAuthGuard()
    @Patch('/:transaction_board_id/:transaction_completed')
    @ApiOperation({summary: '거래게시판 거래 확정', description: ''})
    @ApiCreatedResponse({description:'오류 없으면 게시글 ID값이 보내질거임 json형식 아님'})
    updateTransactionCompleted(
        @Param('transaction_board_id')transaction_board_id: number,
        @Param('transaction_completed')transaction_completed: number,
        @AuthUser()user: User
    ): Promise<number> {
        return this.transactionBoardService.updateTransactionCompleted(transaction_board_id,transaction_completed,user);
    }
}
