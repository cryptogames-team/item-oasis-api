import { ElasticsearchModuleAsyncOptions } from '@nestjs/elasticsearch';
import * as dotenv from 'dotenv';
dotenv.config();

export const ElasticSearchConfig: ElasticsearchModuleAsyncOptions = {
    useFactory: () => ({
        node: process.env.ELASTIC_HOST,
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        sniffOnStart: true
    })
}