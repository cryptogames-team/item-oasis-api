import { Module } from '@nestjs/common';
import { UserController } from '../../controller/user/user.controller';
import { UserService } from '../../service/user/user.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { UserRepository } from '../../repository/user/user.repository';
import { JwtStrategy } from '../../utils/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtRefreshTokenStrategy } from 'src/utils/jwt/refresh-token.strategy';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SCRET_KEY,
      signOptions : {
        expiresIn: '2h',
      }
    }),
    TypeOrmExModule.forCustomRepository([UserRepository])
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy,JwtRefreshTokenStrategy],
  exports: [JwtStrategy, PassportModule, JwtRefreshTokenStrategy]
})
export class UserModule {}
