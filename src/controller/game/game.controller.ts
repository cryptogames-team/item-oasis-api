import { Controller, Get, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameServer } from 'src/entity/game/game-server.entity';
import { GameService } from 'src/service/game/game.service';

@ApiTags('게임 API')
@Controller('game')
export class GameController {
    constructor(
        private gameService: GameService
    ){}
    
    @Get('/game-server/:game_id')
    @ApiOperation({summary: '게임의 서버 리스트', description: '게시글 ID값은 param으로 게시글 내용은 body에 담을 것'})
    @ApiCreatedResponse({description:'게임 ID값 넣기', type : [GameServer]})
    getGameServerByGameID(
        @Param('game_id')game_id: number
    ) {
        return this.gameService.getGameServerByGameID(game_id);
    }
}
