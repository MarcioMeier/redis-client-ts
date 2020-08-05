import { Redis } from './redis/Redis';
import { RedisSocket } from './socket/RedisSocket';
import { Handler } from './Handler';

const redis = new Redis(new RedisSocket());

const handler = new Handler('127.0.0.1', 6379, redis);

handler.execute();