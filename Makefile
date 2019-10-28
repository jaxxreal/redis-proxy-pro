.PHONY: test build

build-app:
	docker build -f Dockerfile.web -t jaxxreal/redis-proxy-pro-web-app .

build-tests:
	docker build -f Dockerfile.tests -t jaxxreal/redis-proxy-pro-web-app-tests .

run-web:
	docker run -p $(port):8081 jaxxreal/redis-proxy-pro-web-app

run-redis:
	docker run -p $(port):6379 redis:latest

run-tests:
	docker run jaxxreal/redis-proxy-pro-web-app-tests

kill-web:
	 docker rm $(docker stop $(docker ps -a -q --filter ancestor=jaxxreal/redis-proxy-pro-web-app --format="{{.ID}}"))

test:
	make build-app run-web port=49160 build-tests run-tests