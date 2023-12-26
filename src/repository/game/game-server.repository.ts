import { CustomRepository } from "src/core/typeorm-ex.decorator";
import { GameServer } from "src/entity/game/game-server.entity";
import { GameInfo } from "src/entity/game/game.entity";
import { Repository } from "typeorm";

@CustomRepository(GameServer)
export class GameServerRepository extends Repository<GameServer> {
    async getGameServerByGameID(game_id: number) {
        const query = this.createQueryBuilder('game_server')
                        .andWhere('game_server.game_id = :game_id', {game_id});

        return await query.getMany();
    }

}