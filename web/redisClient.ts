import * as redis from 'redis';

export class RedisClient {
    private client: redis.RedisClient;
    private queueName = 'queue';

    constructor(
        private hostname: string,
        private cacheExpiryTime: number,
        private maxCapacity: number,
    ) {
        this.client = redis.createClient(this.hostname);
    }

    get = (resource: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            this.client.get(resource, async(error, value: string) => {
                if (error) {
                    return reject(error);
                }

                await this.updateKeyPosition(resource);

                return resolve(value)
            });
        });
    }

    atomicSet = async (resource: string, value: string): Promise<boolean> => {
        const capacity = await this.lrange(this.queueName, 0, this.maxCapacity);

        if (capacity.length === this.maxCapacity) {
            await this.removeLeastUsedKey();
        }

        return new Promise((resolve) => {
            const multi = this.client.multi();
            multi.set(resource, value);
            multi.expire(resource, this.cacheExpiryTime);

            multi.exec(async(error) => {
                if (error) {
                    return resolve(false);
                }

                await this.updateKeyPosition(resource);

                return resolve(true);
            });
        });
    }

    lpush(listName: string, value: string) {
        return new Promise((resolve, reject) => {
            this.client.lpush(listName, value, (err: Error | null, reply: any) => {
                if (err) {
                    return reject(err);
                }

                resolve(reply);
            });
        });
    }

    lrem(listName: string, count: number, value: string) {
        return new Promise((resolve, reject) => {
            this.client.lrem(listName, count, value, (err: Error | null, reply: any) => {
                if (err) {
                    return reject(err);
                }

                resolve(reply);
            });
        });
    }

    rpop(listName: string) {
        return new Promise((resolve, reject) => {
            this.client.rpop(listName, (err: Error | null, reply: any) => {
                if (err) {
                    return reject(err);
                }

                resolve(reply);
            });
        });
    }

    lrange(listName: string, start: number, stop: number): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.client.lrange(listName, start, stop, (err: Error | null, reply: any) => {
                if (err) {
                    return reject(err);
                }

                resolve(reply);
            });
        });
    }

    async updateKeyPosition(key: string) {
        await this.lrem(this.queueName, 0, key);
        await this.lpush(this.queueName, key);
    }

    removeLeastUsedKey() {
        return this.rpop(this.queueName);
    }
}


