import { User } from "../../entity/user/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserAndAccessToken {
    @ApiProperty({description: '엑세스토큰'})
    accessToken: string;

    @ApiProperty({description: '리플레시토큰'})
    refreshToken: string;
    
    @ApiProperty({description: '유저'})
    user: User;
  }