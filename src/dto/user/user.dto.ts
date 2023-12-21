import { IsString, MaxLength,IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {

    @IsString()
    @MaxLength(12)
    @IsNotEmpty()
    @ApiProperty({description: '이름'})
    user_name: string;
}