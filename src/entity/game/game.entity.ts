import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { GameServer } from "./game-server.entity";

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

}