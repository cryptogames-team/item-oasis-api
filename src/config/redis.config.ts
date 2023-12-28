import { RedisClientOptions } from "@liaoliaots/nestjs-redis";
import * as dotenv from 'dotenv';
dotenv.config();

export const RedisConfig: RedisClientOptions = {
    host: process.env.HOST,
    port: +process.env.REDIS_PORT,
    password: process.env.DB_PASSWD
}