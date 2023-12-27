import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { RefTokenDto, UserDto } from '../../dto/user/user.dto';
import { User } from '../../entity/user/user.entity';
import { UserRepository } from '../../repository/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { S3FolderName, mediaUpload } from 'src/utils/s3-util';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService,
        @InjectRedis() private client: Redis
    ){}

    async createOrGetUser(userDto: UserDto): Promise<{accessToken: string, refreshToken: string, user: User}> {
        const { user_name } = userDto;

        let user: User;

        const checkUser_bool = await this.userRepository.checkUser(userDto);
        if(checkUser_bool){
            user = await this.userRepository.getUser(user_name);
        }else {
            user = await this.userRepository.createUser(userDto);
        }
        
        const accessToken = await this.jwtService.sign({ user_name },{
            secret: process.env.JWT_SCRET_KEY,
            expiresIn: '1h'
        });

        const refreshToken = await this.jwtService.sign({ user_name },{
            secret: process.env.JWT_SCRET_KEY,
            expiresIn: '12h'
        });

        this.client.set(refreshToken,user_name, 'EX', 12 * 60 * 60);

        return {accessToken,refreshToken, user};
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

    async getNewAccessToken(refreshToken: RefTokenDto) {
        const { refToken } = refreshToken;
        const refresh_redis = await this.client.get(refToken);

        if(!refresh_redis){
            throw new UnauthorizedException('서버에 refreshToken이 없음');  
        }

        const refreshTokenMatches = await this.jwtService.verify(refToken);
        if (!refreshTokenMatches) {
          throw new UnauthorizedException('refreshToken이 재발급 요망');
        }
    
        const accessToken = await this.jwtService.sign({ user_name : refresh_redis },{
            secret: process.env.JWT_SCRET_KEY,
            expiresIn: '1h'
        });
    
        return {
            accessToken,
        };
      }
}
