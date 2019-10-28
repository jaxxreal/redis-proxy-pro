import convict from 'convict';

export const config = convict({
    env: {
        doc: 'The application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    port: {
        doc: 'The port to bind.',
        format: 'port',
        default: 8081,
        env: 'PORT',
        arg: 'port'
    },
    redis: {
        hostname: {
            doc: 'Redis Server Connection Url',
            default: 'http://localhost:6379',
            env: 'REDIS_URL',
        },
        cacheExpiryTime: {
            doc: 'Redis key expiry time in seconds',
            default: 30,
            env: 'CACHE_EXPIRY_TIME',
        },
        maxCapacity: {
            doc: 'Max number of Redis key stored',
            default: 50,
            env: 'MAX_CAPACITY',
        }
    },
});
