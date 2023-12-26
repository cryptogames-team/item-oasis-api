import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { GameInfo } from "./game.entity";

@Entity({name: 'game_server'})
export class GameServer extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    game_server_id: number;

    @ApiProperty()
    @ManyToOne(()=> GameInfo, gameinfo => gameinfo.game_id, {eager: false})
    @JoinColumn({name: "game_id"})
    game_id: number;

    @ApiProperty()
    @Column()
    game_server_name: string;


}