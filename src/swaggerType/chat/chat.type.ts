import { ApiProperty } from "@nestjs/swagger";
import { Chat } from "src/entity/chat/chat.entity";
import { GameInfo } from "src/entity/game/game.entity";
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

export class ChatTitleResponse {

    @ApiProperty()
    transaction_id : number;

    @ApiProperty()
    seller : string;

    @ApiProperty()
    buyer : string;

    @ApiProperty()
    buy_confirmation : number;

    @ApiProperty()
    sell_confirmation : number;

    @ApiProperty()
    transaction_completed : number;

    @ApiProperty()
    is_fraud : number;

    @ApiProperty()
    transaction_board_id : number;

    @ApiProperty()
    price: string;

    @ApiProperty()
    date: string;

    @ApiProperty()
    game : GameInfo;
    
    @ApiProperty()
    item_count : number;

    @ApiProperty()
    chat : Chat;

    @ApiProperty()
    user : User;

    @ApiProperty()
    game_server : number;

    @ApiProperty()
    item_type : number;

    @ApiProperty()
    unread_count : number;
}