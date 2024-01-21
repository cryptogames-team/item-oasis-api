import { Controller, Get, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchService } from 'src/service/search/search.service';

@ApiTags('검색')
@Controller('search')
export class SearchController {
    constructor(
        private searchService: SearchService
    ){}

    @Get('/:keyword')
    @ApiOperation({summary: '게임 검색', description: '게임 검색'})
    @ApiCreatedResponse({description:'결과 보내줌 배열로'})
    search(@Param('keyword')keyword: string){
        return this.searchService.search(keyword);
    }
}
