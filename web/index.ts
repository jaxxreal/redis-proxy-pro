import Koa from 'koa';
import pino from 'koa-pino-logger';
import Router from 'koa-router';
const koaBody = require('koa-body');

import { RedisClient } from './redisClient';
import { config } from './config';

const router = new Router();
const logger = pino();
const redisClient = new RedisClient(
    config.get('redis.hostname'),
    config.get('redis.cacheExpiryTime'),
    config.get('redis.maxCapacity')
);
const app = new Koa();

console.log('Run using config:', config.toString());

app.use(logger);
app.use(koaBody());

router
    .get('/:key', async (ctx) => {
        const cacheValue = await redisClient.get(ctx.params.key);
        ctx.body = cacheValue;
    })
    .post('/', async (ctx) => {
        const { key, value } = (ctx.request as any).body as { key: string, value: any };

        const success = await redisClient.atomicSet(key, value);

        ctx.body = { success };
    });

app.use(router.routes());

const appPort = config.get('port');

app.listen(appPort);

console.info(`Listening to http://localhost:${appPort} 🚀`);
