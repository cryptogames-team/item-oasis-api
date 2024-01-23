import { BaseEntity, Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { GameServer } from "./game-server.entity";
import { TransactionBoard } from "../transactionBoard/transaction-board.entity";


@Entity({name: 'game_info'})
export class GameInfo extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    game_id: number;

    @ApiProperty()
    @Column()
    game_name: string;
    
    @OneToMany(()=> GameServer, game_server => game_server.game_id, {eager: false})
    game_server: GameServer[];

    @OneToMany(()=> TransactionBoard, transaction_board => transaction_board.game_id, {eager : false})
    game: GameInfo;


}