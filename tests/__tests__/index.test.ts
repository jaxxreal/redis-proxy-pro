import axios from 'axios';

import {LittleRedisClient} from '../littleRedisClient';
import { config } from '../../config';

const CACHE_SERVER_URL = `http://localhost:${config.get('port')}`;
const cache = Object.freeze({ key: '1', value: 'some cached value' });

describe('Redis-cache client', () => {
    const redis = new LittleRedisClient('http://localhost:6300');

    it(`RedisClient exists`, () => {
        expect(LittleRedisClient).toBeTruthy();
    });

    it('Writes value to Redis instance', async(done) => {

        for (let i = 0; i < 10; i++) {
            const cacheKey = `${cache.key}-${i}`;
            const resp = await axios.post(CACHE_SERVER_URL, {
                key: cacheKey,
                value: cache.value
            });

            expect(resp.data).toHaveProperty('success');
            expect(resp.data.success).toBe(true);

            const cacheValue = await redis.get(cacheKey);
            expect(cacheValue).toBe(cache.value);
        }

        done();
    });

    it('Read/write cache value', async (done) => {
        const resp = await axios.post(CACHE_SERVER_URL, cache);

        expect(resp.data).toHaveProperty('success');
        expect(resp.data.success).toBe(true);

        const { data } = await axios.get(`${CACHE_SERVER_URL}/${cache.key}`);

        expect(data).toBe(cache.value);

        done();
    });

    afterAll(() => {
        redis.quit();
    });
});
