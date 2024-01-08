import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/entity/user/user.entity";

export class ChatResponse {

    @ApiProperty({description: 'chat_id'})
    chat_id: number;

    @ApiProperty({description: 'chat_type'})
    chat_type: number;

    @ApiProperty({description: 'chat_content'})
    chat_content: string;

    @ApiProperty({description: 'chat_date'})
    chat_date: string;

    @ApiProperty({description: 'chat_room'})
    chat_room: string;

    @ApiProperty({description: 'user'})
    user_id: User;
}