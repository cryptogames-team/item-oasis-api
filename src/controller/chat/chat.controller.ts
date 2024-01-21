import { Body, Controller, Get, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import UseAuthGuard from 'src/auth-guards/use-auth';
import AuthUser from 'src/core/auth-user.decorator';
import { Chat } from 'src/entity/chat/chat.entity';
import { User } from 'src/entity/user/user.entity';
import { ChatService } from 'src/service/chat/chat.service';
import { ChatResponse, ChatTitleResponse } from 'src/swaggerType/chat/chat.type';

@ApiTags('채팅 API')
@UseAuthGuard()
@Controller('chat')
export class ChatController {
    constructor(
        private  chatService: ChatService
    ){}

    @Get('/chat_room/:chat_room')
    @ApiOperation({summary: '방ID로 해당 방 채팅내역 불러오기', description: '엑세스토큰 포함시킬것'})
    @ApiCreatedResponse({description:'채팅 목록 보냄', type: [ChatResponse]})
    @ApiBearerAuth('access-token')
    getChatByRoom(@Param('chat_room')chat_room: number){
        return this.chatService.getChatByRoom(chat_room);
    }

    @Get('/chat_title/:sale_type/:type')
    @ApiBearerAuth('access-token')
    @ApiOperation({summary: '채팅방 목록 가져오기', description: 'sale_type은 거래 중 0, 거래완료 1, type은 전체 0, 판매중 1, 구매 중 1'})
    @ApiCreatedResponse({type : [ChatTitleResponse]})
    getChatRoomTitle(
        @AuthUser()user: User,
        @Param('type')type: number,
        @Param('sale_type')sale_type: number){
        return this.chatService.getChatRoomTitle(user,type,sale_type);
    }

    @Post('/chat_image')
    @ApiBearerAuth('access-token')
    @ApiOperation({summary: '채팅 이미지 업로드', description: '파일 하나 보낼 것'})
    @ApiCreatedResponse({description:'이미지 주소 보낼 거임'})
    @UseInterceptors(FileInterceptor('file'))
    uploadChatImage(
        @UploadedFile()file: Express.Multer.File
    ){
        return this.chatService.uploadChatImage(file);
    }
}
