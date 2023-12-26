import { Injectable } from '@nestjs/common';
import { GameServerRepository } from 'src/repository/game/game-server.repository';
import { GameRepository } from 'src/repository/game/game.repository';

@Injectable()
export class GameService {

    constructor(
        private gameRepository: GameRepository,
        private gameServerRepository: GameServerRepository
    ){}

    getGameServerByGameID(game_id: number) {
        return this.gameServerRepository.getGameServerByGameID(game_id);
    }
}
