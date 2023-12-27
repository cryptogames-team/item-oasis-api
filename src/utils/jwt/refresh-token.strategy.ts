import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/repository/user/user.repository';
import { User } from 'src/entity/user/user.entity';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env.REFRESH_JWT_SCRET_KEY,
    });
  }

  async validate(req: Request, payload: any) {
    const { user_name } = payload;
    const user: User = await this.userRepository.findOne({where:{user_name}});

    if(!user){
        throw new UnauthorizedException('리플레쉬 토큰 재발급 요망');
    }

    return user;
  }
}