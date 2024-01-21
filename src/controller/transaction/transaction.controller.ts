import { Body, Controller, Post, Get, Patch, ValidationPipe, Param } from '@nestjs/common';
import { TransactionService } from '../../service/transaction/transaction.service';
import { TransactionDTO } from 'src/dto/transaction/transaction.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import UseAuthGuard from 'src/auth-guards/use-auth';
import AuthUser from 'src/core/auth-user.decorator';
import { User } from 'src/entity/user/user.entity';



@ApiTags('트랜잭션 API')
@Controller('transaction')
export class TransactionController {
    constructor(
        private transactionService: TransactionService
    ){}
    
    @UseAuthGuard()
    @Post('/')
    @ApiBearerAuth('access-token')
    @ApiOperation({summary: '거래 등록', description: ''})
    @ApiCreatedResponse({description:'트랜잭션 결과가 보내질 것'})
    create(
        @Body(ValidationPipe)transactionDTO: TransactionDTO,
        @AuthUser()user: User){
        return this.transactionService.create(transactionDTO,user);
    }

    @UseAuthGuard()
    @ApiBearerAuth('access-token')
    @Patch('/buy/:transaction_id')
    @ApiOperation({summary: '구매 확정', description: ''})
    @ApiCreatedResponse({description:'트랜잭션 결과가 보내질 것'})
    buyConfirmed(
        @Param('transaction_id')transaction_id: number,
        @AuthUser()user: User){
        return this.transactionService.buyConfirmed(transaction_id,user);
    }
    @UseAuthGuard()
    @ApiBearerAuth('access-token')
    @Patch('/sell/:transaction_id')
    @ApiOperation({summary: '판매 확정', description: ''})
    @ApiCreatedResponse({description:'트랜잭션 결과가 보내질 것'})
    saleConfirmed(
        @Param('transaction_id')transaction_id: number,
        @AuthUser()user: User){
        return this.transactionService.saleConfirmed(transaction_id,user);
    }
    @UseAuthGuard()
    @ApiBearerAuth('access-token')
    @Patch('/fraud/:transaction_id')
    @ApiOperation({summary: '사기 등록', description: ''})
    @ApiCreatedResponse({description:'트랜잭션 결과가 보내질 것'})
    setIsFraud(
        @Param('transaction_id')transaction_id: number,
        @AuthUser()user: User){
        return this.transactionService.setIsFraud(transaction_id,user);
    }

    @Get('/seller/:seller')
    @ApiOperation({summary: '판매자의 거래 리스트', description: ''})
    @ApiCreatedResponse({description:'테이블 리스트가 갈거'})
    getTableBySeller(@Param('seller')seller: string){
        return this.transactionService.getTableBySeller(seller);
    }

    @Get('/buyer/:buyer')
    @ApiOperation({summary: '구매자의 거래 리스트', description: ''})
    @ApiCreatedResponse({description:'테이블 리스트가 갈거'})
    getTableByBuyer(@Param('buyer')buyer: string){
        return this.transactionService.getTableByBuyer(buyer);
    }

   
}
