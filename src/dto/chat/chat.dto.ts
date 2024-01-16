import { ApiProperty } from "@nestjs/swagger";

export class ChatDTO {

    @ApiProperty({description: '채팅 내용'})
    chat_content: string;

    @ApiProperty({description: '채팅 방'})
    chat_room: string;

    @ApiProperty({description: '유저 아이디'})
    user_id: number;

    @ApiProperty({description: '채팅 타입 0:text,1:image'})
    chat_type: number;

    is_read: number;

    chat_date: string;
}