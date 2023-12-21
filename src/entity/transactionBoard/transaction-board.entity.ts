import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/entity/user/user.entity";
import { TransactionDetailImage } from "./transaction_detail-image.entity";

@Entity({name: 'transaction_board'})
export class TransactionBoard extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    transaction_board_id: number;

    @ApiProperty()
    @Column()
    transaction_board_title: string;

    @ApiProperty()
    @Column()
    transaction_board_game: number;

    @ApiProperty()
    @Column()
    transaction_board_server: number;

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
    @ManyToOne(()=> User, user => user.transaction_board, {eager: false})
    @JoinColumn({name: "user_id"})
    user_id: number;
    
    @OneToMany(()=> TransactionDetailImage, detail_image => detail_image.transaction_board_id, {eager: false})
    transaction_detail_image: TransactionDetailImage[];


}