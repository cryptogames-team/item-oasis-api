import { User } from "../../entity/user/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class AccessToken {
  @ApiProperty({description: '엑세스토큰'})
  accessToken: string;
}

export class UserAndAccessToken extends AccessToken{
    

    @ApiProperty({description: '리플레시토큰'})
    refreshToken: string;

    @ApiProperty({description: '유저'})
    user: User;
  }

