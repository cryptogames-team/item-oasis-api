import { Module } from '@nestjs/common';
import { UserController } from '../../controller/user/user.controller';
import { UserService } from '../../service/user/user.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { UserRepository } from '../../repository/user/user.repository';
import { JwtStrategy } from '../../utils/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SCRET_KEY,
      signOptions : {
        expiresIn: 60 * 60,
      }
    }),
    TypeOrmExModule.forCustomRepository([UserRepository])
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class UserModule {}
