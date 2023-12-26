import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/entity/user/user.entity";
import { TransactionDetailImage } from "./transaction_detail-image.entity";
import { GameInfo } from "../game/game.entity";
import { GameServer } from "../game/game-server.entity";

@Entity({name: 'transaction_board'})
export class TransactionBoard extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    transaction_board_id: number;

    @ApiProperty()
    @Column()
    transaction_board_title: string;

    @ApiProperty()
    @OneToOne(()=> GameInfo, gameinfo => gameinfo.game_id, {eager: false})
    @JoinColumn({name: "game_id"})
    game_id: number;

    @ApiProperty()
    @OneToOne(()=> GameServer, game_server => game_server.game_server_id, {eager: false})
    @JoinColumn({name: "game_server_id"})
    game_server_id: number;

    @ApiProperty()
    @Column()
    transaction_board_type: number;

    @ApiProperty()
    @Column()
    transaction_board_item_type: number;

    @ApiProperty()
    @Column()
    transaction_board_sale_type: number;

    @ApiProperty()
    @Column()
    transaction_board_amount: number;

    @ApiProperty()
    @Column()
    transaction_board_min_amount: number;

    @ApiProperty()
    @Column()
    transaction_board_item_price: number;

    @ApiProperty()
    @Column()
    transaction_board_detail: string;

    @ApiProperty()
    @Column()
    transaction_board_character_name: string;

    @ApiProperty()
    @Column()
    transaction_board_date: string;

    @ApiProperty()
    @Column({ default : 0 })
    transaction_completed: number;


    @ApiProperty()
    @ManyToOne(()=> User, user => user.transaction_board, {eager: false})
    @JoinColumn({name: "user_id"})
    user_id: number;
    
    @OneToMany(()=> TransactionDetailImage, detail_image => detail_image.transaction_board_id, {eager: false})
    transaction_detail_image: TransactionDetailImage[];


}