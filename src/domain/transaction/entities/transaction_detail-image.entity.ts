import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionBoard } from "./transaction-board.entity";

@Entity({name: 'transaction_detail_image'})
export class TransactionDetailImage extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    transaction_detail_image_id: number;


    @ManyToOne(()=> TransactionBoard, transaction_board => transaction_board.transaction_board_id, {eager: false})
    @JoinColumn({name: "transaction_board_id"})
    transaction_board_id: number;

    @ApiProperty()
    @Column()
    transaction_detail_image: string;
    


}