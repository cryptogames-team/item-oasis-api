import { Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import UseAuthGuard from 'src/auth-guards/use-auth';
import AuthUser from 'src/core/auth-user.decorator';
import { User } from 'src/entity/user/user.entity';
import { ChatService } from 'src/service/chat/chat.service';

@Controller('chat')
export class ChatController {
    constructor(
        private  chatService: ChatService
    ){}

    @Get('/chat_room/:chat_room')
    @UseAuthGuard()
    getChatByRoom(@Param('chat_room')chat_room: number){
        return this.chatService.getChatByRoom(chat_room);
    }

    @Get('/chat_title/')
    @UseAuthGuard()
    getChatRoomTitle(@Body('chat_room')chat_room: string[]){
        return this.chatService.getChatRoomTitle(chat_room);
    }

    @Post('/chat_image')
    @UseAuthGuard()
    @UseInterceptors(FileInterceptor('file'))
    uploadChatImage(
        @UploadedFile()file: Express.Multer.File
    ){
        return this.chatService.uploadChatImage(file);
    }
}
