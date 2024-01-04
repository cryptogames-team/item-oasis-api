import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionBoard } from "src/entity/transactionBoard/transaction-board.entity";
import { Chat } from "../chat/chat.entity";

@Entity({name: 'user'})
@Unique(['user_name'])
export class User extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    user_id: number;

    @ApiProperty()
    @Column()
    user_name: string;

    @ApiProperty()
    @Column()
    profile_image: string;

    @ApiProperty()
    @Column()
    user_rating: number;

    @OneToMany(type => TransactionBoard, transactionBoard => transactionBoard.user_id, {eager: false})
    transaction_board: TransactionBoard[];

    @OneToMany(type => Chat, chat => chat.user_id, {eager: false})
    chat: Chat;
}