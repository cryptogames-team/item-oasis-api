import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../entity/user/user.entity";
import { UserRepository } from "../../repository/user/user.repository";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ){
        super({
            secretOrKey: process.env.JWT_SCRET_KEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload){
        const { user_name } = payload;
        const user: User = await this.userRepository.findOne({where:{user_name}});

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }
}