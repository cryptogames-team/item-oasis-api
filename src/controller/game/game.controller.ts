import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from 'src/service/game/game.service';

@Controller('game')
export class GameController {
    constructor(
        private gameService: GameService
    ){}
    
    @Get('/game-server/:game_id')
    getGameServerByGameID(
        @Param('game_id')game_id: number
    ) {
        return this.gameService.getGameServerByGameID(game_id);
    }
}
