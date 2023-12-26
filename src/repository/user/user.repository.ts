import { CustomRepository } from "src/core/typeorm-ex.decorator";
import { User } from "../../entity/user/user.entity";
import { Repository } from "typeorm";
import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UserDto } from "../../dto/user/user.dto";

@CustomRepository(User)
export class UserRepository extends Repository<User> {

    async getUser(user_name: string): Promise<User> {
        const user = await this.findOne({ where : { user_name} });

        if (!user) {
            throw new NotFoundException(`Cant't found user name by ${user_name}`);
        }

        return user;
    }

    async checkUser(userDto: UserDto): Promise<Boolean> {
        const {user_name} = userDto;
        try{
            const user = await this.findOne({ where : { user_name} });
            return !!user;
        }catch(error){
            return false;
        }
        
    }

    async createUser(userDto: UserDto): Promise<User>{
        const {user_name} = userDto;

        const user = this.create({user_name , profile_image : "" , user_rating : 0})

        try{
            return await this.save(user);
        }catch(error){
            console.log(error)
            if(error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Existing username');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async uploadProfileImage(user: User, filePath: string): Promise<User> {
        const user_row = await this.getUser(user.user_name);
    
        user_row.profile_image = filePath;
        const save_user = await this.save(user_row);

        if(!save_user){
            throw new InternalServerErrorException();
        }

        return user_row;
    }

    async updateRating(user_name: string, sale_count: number) {
        const user_row = await this.getUser(user_name);
    
        if(sale_count >= 1 && sale_count < 20) user_row.user_rating = 1;
        if(sale_count >= 20 && sale_count < 100) user_row.user_rating = 2;
        if(sale_count >= 100 && sale_count < 250) user_row.user_rating = 3;
        if(sale_count >= 250) user_row.user_rating = 4;

        const save_user = await this.save(user_row);

        if(!save_user){
            throw new InternalServerErrorException();
        }

        return user_row;
    }
}