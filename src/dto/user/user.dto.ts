import { IsString, MaxLength,IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {

    @IsString()
    @MaxLength(12)
    @IsNotEmpty()
    @ApiProperty({description: '이름'})
    user_name: string;
}

export class RefTokenDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'refreshToken'})
    refToken: string;
}

export class AccessAndRefTokenDto extends RefTokenDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({description: 'accessToken'})
    accessToken: string;
}