import { Module } from '@nestjs/common';
import { SearchController } from '../../controller/search/search.controller';
import { SearchService } from '../../service/search/search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticSearchConfig } from 'src/config/elastic.config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync(ElasticSearchConfig)
  ],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
