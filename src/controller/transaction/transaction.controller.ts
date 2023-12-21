import { Body, Controller, Post, Get, Delete, Patch, ValidationPipe, Param, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { TransactionService } from '../../service/transaction/transaction.service';
import { TransactionBoardDTO } from '../../dto/transactionBoard/transaction_board.dto';
import { TransactionBoard } from '../../entity/transactionBoard/transaction-board.entity';
import UseAuthGuard from '../../auth-guards/use-auth';
import AuthUser from 'src/core/auth-user.decorator';
import { User } from '../../entity/user/user.entity';
import { GetTransactionBoardByItemType } from '../../dto/transactionBoard/get_transaction_board.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TransactionBoardAndUser, TransactionBoardArrayAndUser } from '../../swaggerType/transactionBoard/getBoard.type';
import { FilesInterceptor } from '@nestjs/platform-express';


@ApiTags('트랜잭션 API')
@Controller('transaction')
export class TransactionController {
    constructor(
        private transactionService: TransactionService
    ){}

   
}
