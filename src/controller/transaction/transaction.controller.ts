import { Body, Controller, Post, Get, Patch, ValidationPipe, Param } from '@nestjs/common';
import { TransactionService } from '../../service/transaction/transaction.service';
import { TransactionDTO } from 'src/dto/transaction/transaction.dto';
import { ApiTags } from '@nestjs/swagger';
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
    create(@Body(ValidationPipe)transactionDTO: TransactionDTO){
        return this.transactionService.create(transactionDTO);
    }

    @UseAuthGuard()
    @Patch('/buy/:transaction_id')
    buyConfirmed(
        @Param('transaction_id')transaction_id: number,
        @AuthUser()user: User){
        return this.transactionService.buyConfirmed(transaction_id,user);
    }
    @UseAuthGuard()
    @Patch('/sell/:transaction_id')
    saleConfirmed(
        @Param('transaction_id')transaction_id: number,
        @AuthUser()user: User){
        return this.transactionService.saleConfirmed(transaction_id,user);
    }
    @UseAuthGuard()
    @Patch('/fraud/:transaction_id')
    setIsFraud(
        @Param('transaction_id')transaction_id: number,
        @AuthUser()user: User){
        return this.transactionService.setIsFraud(transaction_id,user);
    }

    @Get('/seller/:seller')
    getTableBySeller(@Param('seller')seller: string){
        return this.transactionService.getTableBySeller(seller);
    }

    @Get('/buyer/:buyer')
    getTableByBuyer(@Param('buyer')buyer: string){
        return this.transactionService.getTableByBuyer(buyer);
    }

   
}
