import * as redis from 'redis';

export class LittleRedisClient {
    private client: redis.RedisClient;

    constructor(
        private hostname: string,
    ) {
        this.client = redis.createClient(this.hostname);
    }

    get = (resource: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            this.client.get(resource, async (error, value: string) => {
                if (error) {
                    return reject(error);
                }

                return resolve(value)
            });
        });
    }

    quit = () => {
        return new Promise(resolve => {
            this.client.quit(() => resolve());
        });
    }
}
