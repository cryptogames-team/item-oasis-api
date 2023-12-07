import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({name: 'user'})
@Unique(['user_name'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @Column()
    profile_image: string;
}