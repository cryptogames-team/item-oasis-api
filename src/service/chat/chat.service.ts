import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ChatDTO } from 'src/dto/chat/chat.dto';
import { ChatRepository } from 'src/repository/chat/chat.repository';
import { S3FolderName, mediaUpload } from 'src/utils/s3-util';

@Injectable()
export class ChatService {

    constructor(
        private chatRepository: ChatRepository
    ){}

    addChat(chatDTO: ChatDTO){
        return this.chatRepository.addChat(chatDTO);
    }

    getChatByRoom(chat_room: number){
        return this.chatRepository.getChatByRoom(chat_room);
    }

    async getChatRoomTitle(chat_rooms: string[]){
        let chat_titles = [];
        for(const chat_room of chat_rooms){
             chat_titles.push(await this.chatRepository.getChatRoomTitle(chat_room));
        }
        return chat_titles;
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
