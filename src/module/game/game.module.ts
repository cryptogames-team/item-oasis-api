import { Module } from '@nestjs/common';
import { GameController } from '../../controller/game/game.controller';
import { GameService } from '../../service/game/game.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { GameRepository } from 'src/repository/game/game.repository';
import { GameServerRepository } from 'src/repository/game/game-server.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([GameRepository,GameServerRepository])
  ],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
