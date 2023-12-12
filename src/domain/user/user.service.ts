import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { S3FolderName, mediaUpload } from 'src/utils/s3-util';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}

    async createOrGetUser(userDto: UserDto): Promise<{accessToken: string, user: User}> {
        const { user_name } = userDto;

        let user: User;

        const checkUser_bool = await this.userRepository.checkUser(userDto);
        if(checkUser_bool){
            user = await this.userRepository.getUser(user_name);
        }else {
            user = await this.userRepository.createUser(userDto);
        }
        
        const accessToken = await this.jwtService.sign({ user_name });

        return {accessToken, user};
    }

    getUser(user_name: string): Promise<User> {
        return this.userRepository.getUser(user_name);
    }

    async uploadProfileImage(user: User,file: Express.Multer.File): Promise<User>{

        if(!file) {
            throw new NotFoundException(`select the image file`);
        }
        const url = await mediaUpload(file, S3FolderName.PROFILE);

        if(!url){
            throw new InternalServerErrorException();
        }

        return this.userRepository.uploadProfileImage(user,url);
    }
}
