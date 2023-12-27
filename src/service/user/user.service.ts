import { Injectable, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserDto } from '../../dto/user/user.dto';
import { User } from '../../entity/user/user.entity';
import { UserRepository } from '../../repository/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { S3FolderName, mediaUpload } from 'src/utils/s3-util';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
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
            expiresIn: '5s'
        });

        const refreshToken = await this.jwtService.sign({ user_name },{
            secret: process.env.REFRESH_JWT_SCRET_KEY,
            expiresIn: '1s'
        });

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

    // async getNewAccessToken(userAgent: string, refToken: string) {
    
    //     const refreshTokenMatches = await this.jwtService.verify(refToken);
    //     if (!refreshTokenMatches) {
    //       throw new UnauthorizedException('리플레쉬 토큰 재발급 요망');
    //     }
    
    //     // 3. 액세스토큰 재생성
    //     const accessToken = await this.jwtService.sign({ user_name },{
    //         secret: process.env.JWT_SCRET_KEY,
    //         expiresIn: '5s'
    //     });
    
    //     return {
    //       accessToken,
    //     };
    //   }
}
