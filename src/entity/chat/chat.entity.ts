import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/entity/user/user.entity";

@Entity({name: 'chat'})
export class Chat extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    chat_id: number;

    @ApiProperty()
    @Column()
    chat_type: number;


    @ApiProperty()
    @Column()
    chat_content: string;

    @ApiProperty()
    @Column()
    chat_date: string;

    @ApiProperty()
    @Column()
    chat_room: string;

    @ApiProperty()
    @Column()
    is_read: number;

    @ApiProperty()
    @ManyToOne(()=> User, user => user.transaction_board, {eager: false})
    @JoinColumn({name: "user_id"})
    user_id: number;


}