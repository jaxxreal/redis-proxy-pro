## High-level architecture overview

What we have?

NodeJS server using Koa web framework (named as web server below) running that's bypassing requests to a Redis instance, each running in their own container.
Web server is running using [pm2](https://github.com/Unitech/pm2) within a docker container.
Redis is running using [redis:alpine](https://hub.docker.com/_/redis) image.
Also we use [docker-compose](https://docs.docker.com/compose/) to run them at once.

Tests is also being built into a docker image, designed to be run within a docker container.

## What the code does

### web directory
We have a [light-weight wrapper](./web/redisClient.ts) for [node_redis](https://github.com/NodeRedis/node_redis) to provide promise-based API and encapsulate some business logic such as max capacity based on keys stored in Redis.

Per each redis read or write it keeps track of recency that keys accessed, to evict keys when max capacity being hit.

A [web server](./web/index.ts) is just one file b/c of its size. It provides really small API like:

Write data to Redis:
```
curl --request POST \
  --url http://localhost:8081/ \
  --header 'content-type: application/json' \
  --data '{
	"key": "1",
	"value": "some data input"
}'
```

Read the data from Redis:
```
curl --request GET \
  --url http://localhost:8081/1
```

That's bascially it.

### tests directory

Here we have end to end tests. It designed a way to hit a cache server endpoint, then verify writes via direct connection to baked Redis instance.

### config directory

Here we have a configuration files designed to be shared between web and tests images.

## Algorithmic complexity of the cache operations

For writes: O(N+1), where N is the number of keys in Redis

For reads: O(N+1), where N is the number of keys in Redis

## Instructions for how to run the proxy and tests

For running the proxy and tests we use [make](https://www.gnu.org/software/make/).

For running tests, run the following command under project root:
```
make test // build and run a web server, then build and run tests.
```

For building and running the proxy, run the following command under project root:
```
make run
```

## How much time was spent on each part of the project

_Note: I'm completely newbie in docker._

Roughly, it's about 10 hours.

Pure coding, I mean write typescript code, took around 3-4 hours, including figuring out configs for compiling & bootstrapping typescript project for the web app & tests.

The rest of the time, 6-7 hours, was spend purely on figuring out docker, docker compose, how it works, and also project refactoring. Yes, I took a wrong path from the beginning, without taking into account docker specificity. 

## A list of the requirements that was not implemented and the reasons for omitting them

* System tests. Basic requirements was implemented, but it's still not about 100% code coverage. This is controversial question, but I leave it here.
* Sequential concurrent processing. AFAIK NodeJS support concurrent requests out of the box. So, I have a feeling that I didn't get this point clearly.
* Cached GET. Being unsure about interpretation of the previous point, omitted it b/c of possible hidden caveats.