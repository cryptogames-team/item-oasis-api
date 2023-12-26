import { CustomRepository } from "src/core/typeorm-ex.decorator";
import { GameInfo } from "src/entity/game/game.entity";
import { Repository } from "typeorm";

@CustomRepository(GameInfo)
export class GameRepository extends Repository<GameInfo> {


}