import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ChatDTO } from 'src/dto/chat/chat.dto';
import { Chat } from 'src/entity/chat/chat.entity';
import { ChatRepository } from 'src/repository/chat/chat.repository';
import { S3FolderName, mediaUpload } from 'src/utils/s3-util';
import { Api, JsonRpc } from 'eosjs';
import { User } from 'src/entity/user/user.entity';
import { UserRepository } from 'src/repository/user/user.repository';
import { TransactionBoardRepository } from 'src/repository/transactionBoard/transaction-board.repository';
@Injectable()
export class ChatService {
    private rpc: JsonRpc;
    constructor(
        private chatRepository: ChatRepository,
        private userRepository: UserRepository,
        private transactionBoardRepository: TransactionBoardRepository
    ){
        this.rpc = new JsonRpc('https://heptagon-producer1.store');
    }

    addChat(chatDTO: ChatDTO){
        return this.chatRepository.addChat(chatDTO);
    }

    getChatByRoom(chat_room: number): Promise<Chat[]> {
        return this.chatRepository.getChatByRoom(chat_room);
    }

    readMessage(chat_room: string,user_id: number){
        this.chatRepository.readMessage(chat_room,user_id);
    }

    async getBuyerTable(buyer: string){
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
              console.log(response)
              return response.rows;
            } catch (error) {
              console.error('Error:', error);
            }
    }

    async getSellerTable(seller: string){
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
            console.log(response)
            return response.rows;
        } catch (error) {
          console.error('Error:', error);
        }
    }

    async getChatRoomTitle(user: User, type: number,sale_type: number){
        const { user_name, user_id } = user;
        let chat_rooms = [];
        if(+sale_type === 0){
            if(+type === 0){
                const buyer_table = await this.getBuyerTable(user_name);
                const seller_table = await this.getSellerTable(user_name);
                if(buyer_table.length > 0) {
                    for(const table of buyer_table){
                        chat_rooms.push(table);
                    } 
                }
                if(seller_table.length > 0) {
                    for(const table of seller_table){
                        chat_rooms.push(table);
                    } 
                }
            }
            if(+type === 1){
                const seller_table = await this.getSellerTable(user_name);
                chat_rooms = seller_table;
            }
            if(+type === 2) {
                const buyer_table = await this.getBuyerTable(user_name);
                chat_rooms = buyer_table;
            }
        }else {
            const buyer_table = await this.getBuyerTable(user_name);
                const seller_table = await this.getSellerTable(user_name);
                if(buyer_table.length > 0) {
                    for(const table of buyer_table){
                        chat_rooms.push(table);
                    } 
                }
                if(seller_table.length > 0) {
                    for(const table of seller_table){
                        chat_rooms.push(table);
                    } 
                }
        }
        
        console.log(chat_rooms)
        let chat_titles = [];
        for(const chat_room of chat_rooms){
            if(+sale_type === 0){
                if(chat_room.trasaction_completed === 0){
                    chat_titles.push(await this.getTitleByTransaction(chat_room,user_name,user_id));
                }
            }else {
                if(chat_room.trasaction_completed === 1){
                    chat_titles.push(await this.getTitleByTransaction(chat_room,user_name,user_id));
                }
            }
                
        }
        const result = chat_titles.sort((a,b) => {
            const dateA = new Date(a.chat.chat_date).getTime();
            const dateB = new Date(b.chat.chat_date).getTime();
            return dateB - dateA;
        })
        return result;
    }

    async getTitleByTransaction(chat_room, user_name: string,user_id: number){
        const chat = await this.chatRepository.getChatRoomTitle(chat_room.transaction_id,user_id);
        let other_name;
        if(chat_room.seller === user_name){
            other_name = chat_room.buyer;
        }else {
            other_name = chat_room.seller;
        }
        const count = await this.chatRepository.checkUnRead(chat_room.transaction_id,user_id);
        const other_user = await this.userRepository.getUser(other_name);
        const transaction_board = await this.transactionBoardRepository.getTransactionBoardByID(chat_room.transaction_board_id);
        const new_data = {
            transaction_id : chat_room.transaction_id,
            seller : chat_room.seller,
            buyer : chat_room.buyer,
            buy_confirmation : chat_room.buy_confirmation,
            sell_confirmation : chat_room.sell_confirmation,
            transaction_completed : chat_room.trasaction_completed,
            is_fraud : chat_room.is_fraud,
            transaction_board_id : chat_room.transaction_board_id,
            price: chat_room.price,
            date: chat_room.date,
            game : transaction_board.game_id,
            item_count : chat_room.item_count,
            chat : chat,
            user : other_user,
            game_server : transaction_board.game_server_id,
            item_type : transaction_board.transaction_board_item_type,
            unread_count : count
        }
        
        return new_data;
    }

    async uploadChatImage(file: Express.Multer.File){
        if(!file) {
            throw new NotFoundException(`select the image file`);
        }
        const url = await mediaUpload(file, S3FolderName.Chat);

        if(!url){
            throw new InternalServerErrorException();
        }

        return url;
    }

}
