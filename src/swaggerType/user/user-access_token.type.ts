import { User } from "../../entity/user/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserAndAccessToken {
    @ApiProperty({description: '토큰'})
    accessToken: string;

    @ApiProperty({description: '유저'})
    user: User;
  }