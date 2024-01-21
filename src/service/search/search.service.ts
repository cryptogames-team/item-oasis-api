import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
    constructor(private readonly esService: ElasticsearchService){}

    async search(keyword: string){
        const body = await this.esService.search({
            index: 'game_ac',
            body: {
                query: {
                    "match": {
                      "name_ngram": keyword
                    }
                  }
            }
        });
        return body.hits.hits;
    }
}
