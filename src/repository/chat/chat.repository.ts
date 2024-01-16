import { InternalServerErrorException } from "@nestjs/common";
import { CustomRepository } from "src/core/typeorm-ex.decorator";
import { ChatDTO } from "src/dto/chat/chat.dto";
import { Chat } from "src/entity/chat/chat.entity";
import { Repository } from "typeorm";

@CustomRepository(Chat)
export class ChatRepository extends Repository<Chat> {

    async getChatByRoom(chat_room: number): Promise<Chat[]>{
        const query = this.createQueryBuilder('chat')
        .leftJoinAndSelect('chat.user_id', 'user');
        query.andWhere('chat.chat_room = :chat_room', { chat_room });
        query.orderBy('chat.chat_id', 'DESC'); 

        const chats = await query.getMany();

        return chats;
    }

    async addChat(chatDTO: ChatDTO): Promise<Chat> {
        const chat = await this.create(chatDTO);

        try {
            await this.save(chat);
            return chat;
        }catch(error){
            console.log(error)
            throw new InternalServerErrorException();
        }
    
    }

    async readMessage(chat_room: string, user_id: number){
        this.createQueryBuilder('chat')
            .update(Chat)
            .set({ is_read : 1})
            .where('chat.chat_room = :chat_room',{ chat_room})
            .andWhere('chat.user_id != :user_id',{user_id})
            .execute();
    }

    async checkUnRead(chat_room: string, user_id: number){
        const count = await this.createQueryBuilder('chat')
                        .where('chat.chat_room = :chat_room',{ chat_room})
                        .andWhere('chat.user_id != :user_id',{user_id})
                        .andWhere('chat.is_read = 0')
                        .getCount();
        return count;
    }

    async getChatRoomTitle(chat_room: string,user_id: number){

        const query = this.createQueryBuilder('chat');
        query.andWhere('chat.chat_room = :chat_room', { chat_room });
        query.orderBy('chat.chat_id', 'DESC'); 
        return query.getOne();
    }

}