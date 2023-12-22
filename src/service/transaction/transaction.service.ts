import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { TransactionDTO } from 'src/dto/transaction/transaction.dto';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig.js';
import { User } from 'src/entity/user/user.entity';

@Injectable()
export class TransactionService {
    private rpc: JsonRpc;
    private signatureProvider: JsSignatureProvider;
    private hep: Api;
    
    constructor(){
        this.rpc = new JsonRpc('http://14.63.34.160:8888');
        this.signatureProvider = new JsSignatureProvider([process.env.CONTRACT_PRIVATE_KEY]);
        this.hep = new Api({
            rpc: this.rpc,
            signatureProvider: this.signatureProvider
        })
        
    }

    async getTableBySeller(seller: string){
        try{
        const response = await this.rpc.get_table_rows({
            json: true,
            code: process.env.CONTRACT_ACCOUNT_NAME,
            scope: process.env.CONTRACT_ACCOUNT_NAME, 
            table: 'transactions',
            lower_bound : seller,
            upper_bound : seller,
            index_position : 2,
            key_type : 'name',
            limit: 100
          });
          return response.rows;
        } catch (error) {
          console.error('Error:', error);
        }
    }
    
    async getTableByBuyer(buyer: string){
        try{
            const response = await this.rpc.get_table_rows({
                json: true,
                code: process.env.CONTRACT_ACCOUNT_NAME,
                scope: process.env.CONTRACT_ACCOUNT_NAME, 
                table: 'transactions',
                lower_bound : buyer,
                upper_bound : buyer,
                index_position : 3,
                key_type : 'name',
                limit: 100
              });
              return response.rows;
            } catch (error) {
              console.error('Error:', error);
            }
    }

    async create(transactionDTO: TransactionDTO){
        try{
            const result = await this.hep.transact({
                actions: [{
                    account: process.env.CONTRACT_ACCOUNT_NAME,
                    name: 'create',
                    authorization: [{
                      actor: process.env.CONTRACT_ACCOUNT_NAME,  
                      permission: 'active',
                    }],
                    data: transactionDTO
                  }]    
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
            return result;
        }catch(error){
            console.log(error)
            throw new InternalServerErrorException(error);
        }
    }

    async buyConfirmed(transaction_id: number, user: User){
        const { user_name } = user;
        try{
            const response = await this.rpc.get_table_rows({
                json: true,
                code: process.env.CONTRACT_ACCOUNT_NAME,
                scope: process.env.CONTRACT_ACCOUNT_NAME, 
                table: 'transactions',
                lower_bound : transaction_id,
                upper_bound : transaction_id,
                index_position : 1,
                limit: 1
              });
            if(response.rows.length > 0){
                if(response.rows[0].buyer === user_name) {
                    const result = await this.hep.transact({
                        actions: [{
                            account: process.env.CONTRACT_ACCOUNT_NAME,
                            name: 'buyconfirmed',
                            authorization: [{
                              actor: process.env.CONTRACT_ACCOUNT_NAME,  
                              permission: 'active',
                            }],
                            data: {
                                transaction_id
                            }
                          }]    
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30,
                    });
                    return result;
                }else {
                    throw new ForbiddenException(`${transaction_id} is not your transaction`);
                }
            }else {
                throw new NotFoundException(`Can't found transaction By transaction_id : ${transaction_id}`);
            }
            
        }catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async saleConfirmed(transaction_id: number,user: User){
        const { user_name } = user;
        try{
            const response = await this.rpc.get_table_rows({
                json: true,
                code: process.env.CONTRACT_ACCOUNT_NAME,
                scope: process.env.CONTRACT_ACCOUNT_NAME, 
                table: 'transactions',
                lower_bound : transaction_id,
                upper_bound : transaction_id,
                index_position : 1,
                limit: 1
              });
            if(response.rows.length > 0){
                if(response.rows[0].buyer === user_name) {
                    const result = await this.hep.transact({
                        actions: [{
                            account: process.env.CONTRACT_ACCOUNT_NAME,
                            name: 'saleconfirmed',
                            authorization: [{
                              actor: process.env.CONTRACT_ACCOUNT_NAME,  
                              permission: 'active',
                            }],
                            data: {
                                transaction_id
                            }
                          }]    
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30,
                    });
                    return result;
                }else {
                    throw new ForbiddenException(`${transaction_id} is not your transaction`);
                }
            }else {
                throw new NotFoundException(`Can't found transaction By transaction_id : ${transaction_id}`);
            }
            
        }catch(error){
            throw new InternalServerErrorException(error);
        }
    }

    async setIsFraud(transaction_id: number,user: User){
        const { user_name } = user;
        if(user_name === process.env.CONTRACT_ACCOUNT_NAME){

        }else {
            throw new ForbiddenException('your not admin');
        }
        try{
            const response = await this.rpc.get_table_rows({
                json: true,
                code: process.env.CONTRACT_ACCOUNT_NAME,
                scope: process.env.CONTRACT_ACCOUNT_NAME, 
                table: 'transactions',
                lower_bound : transaction_id,
                upper_bound : transaction_id,
                index_position : 1,
                limit: 1
              });
            if(response.rows.length > 0){
                const result = await this.hep.transact({
                    actions: [{
                        account: process.env.CONTRACT_ACCOUNT_NAME,
                        name: 'setisfraud',
                        authorization: [{
                        actor: process.env.CONTRACT_ACCOUNT_NAME,  
                        permission: 'active',
                        }],
                        data: {
                            transaction_id
                        }
                    }]    
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30,
                    });
                return result;
            }else {
                throw new NotFoundException(`Can't found transaction By transaction_id : ${transaction_id}`);
            }
        }catch(error){
            throw new InternalServerErrorException(error);
        }
    }
}