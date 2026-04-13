.PHONY: dev
dev:
	npm run dev

.PHONY: build
build:
	npm run build

.PHONY: start
start:
	npm run start

.PHONY: deps
deps:
	npx depcheck

.PHONY: docker
docker:
	docker buildx bake -f docker-compose.build.yml --push

.PHONY: prod
prod:
	COMPOSE_BAKE=true docker compose --file docker-compose.yml up -d --build
