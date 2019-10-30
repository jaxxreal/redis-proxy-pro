.PHONY: test build

PORT ?= 8081 # web server port
REDIS_PORT ?= 6379 # redis port
CACHE_EXPIRY_TIME ?= 30 # per key, in seconds
MAX_CAPACITY ?= 50 # number of keys stored in redis

all:
	: '$(PORT)'
	: '$(REDIS_PORT)'
	: '$(CACHE_EXPIRY_TIME)'
	: '$(MAX_CAPACITY)'

build-tests:
	docker build -f ./tests/Dockerfile -t jaxxreal/redis-proxy-pro-web-app-tests .

run-redis:
	docker run -p $(port):6379 redis:latest

run:
	export REDIS_PORT=$(REDIS_PORT); \
	export PORT=$(PORT); \
	export CACHE_EXPIRY_TIME=$(CACHE_EXPIRY_TIME); \
	export MAX_CAPACITY=$(MAX_CAPACITY); \
	docker-compose up --build  --detach \

run-tests: build-tests
	echo "Starting testing..."; \
	export REDIS_PORT=$(REDIS_PORT); \
	export PORT=$(PORT); \
	export CACHE_EXPIRY_TIME=$(CACHE_EXPIRY_TIME); \
	export MAX_CAPACITY=$(MAX_CAPACITY); \
	docker run --network="host" jaxxreal/redis-proxy-pro-web-app-tests

kill-web:
	 docker rm $(docker stop $(docker ps -a -q --filter ancestor=jaxxreal/redis-proxy-pro-web-app --format="{{.ID}}"))

test:
	echo "Starting testing..."; \
	export REDIS_PORT=$(REDIS_PORT); \
	export PORT=$(PORT); \
	export CACHE_EXPIRY_TIME=$(CACHE_EXPIRY_TIME); \
	export MAX_CAPACITY=$(MAX_CAPACITY); \
	make run build-tests run-tests; \
	docker-compose stop;