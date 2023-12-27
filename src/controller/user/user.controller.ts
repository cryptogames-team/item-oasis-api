import { Controller, Get, Body, Post, ValidationPipe, Param, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { winstonLogger } from 'src/utils/logger/logger.util';
import { UserDto } from '../../dto/user/user.dto';
import { UserService } from '../../service/user/user.service';
import { User } from '../../entity/user/user.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { UserAndAccessToken } from '../../swaggerType/user/user-access_token.type';
import UseAuthGuard from '../../auth-guards/use-auth';
import { FileInterceptor } from '@nestjs/platform-express';
import AuthUser from 'src/core/auth-user.decorator';

@Controller('user')
@ApiTags('유저 API')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Post('/')
    @ApiOperation({summary: '유저 생성 및 불러오기(로그인)', description: '유저를 생성하는 API 만약 이미 생성된 이력이 있으면 해당 유저 정보를 불러오는 역할을 함'})
    @ApiCreatedResponse({description:'user와 token 보내줌', type: UserAndAccessToken})
    @ApiBody({ type: UserDto })
    createOrGetUser(@Body(ValidationPipe)userDto: UserDto): Promise<{accessToken: string,refreshToken: string, user: User}> {
        return this.userService.createOrGetUser(userDto);
    }

    @Get('/:user_name')
    @ApiOperation({summary: '유저 정보 불러오기', description: '유저 이름으로 유저 정보 불러오기'})
    @ApiCreatedResponse({description:'유저 정보 보내줌', type: User})
    getUserInfo(@Param('user_name')user_name: string) {
        return this.userService.getUser(user_name);
    }

    @Patch('/')
    @UseAuthGuard()
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({summary: '프로필 사진 수정 API', description: '이미지 파일도 담아서 보내야함, 토큰도 포함해서'})
    @ApiCreatedResponse({description:'유저 정보 보내줌', type : User})
    uploadProfileImage(
        @AuthUser()user :User,
        @UploadedFile()file: Express.Multer.File,
    ):Promise<User> {
        return this.userService.uploadProfileImage(user,file);
    }
}
