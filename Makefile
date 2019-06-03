################################################################################
# Copie des dists
$(shell test ! -f docker-compose.override.yml && cp docker-compose.override.dist.yml docker-compose.override.yml)
$(shell test ! -f .env && cp .env.dist .env)
# Inclusion de l'environnement
include .env
export $(shell sed 's/=.*//' .env)
################################################################################

# Action sur conteneurs
build-docker:
	docker-compose build $(c)
up:
	docker-compose up -d $(c)
create:
	make build-docker
	make up
start:
	docker-compose start $(c)
stop:
	docker-compose stop $(c)
down:
	docker-compose down --remove-orphan $(c)
restart:
	make stop
	make start
logs:
	docker-compose logs -f $(c)

rm:
	docker-compose rm -f $(c)

# Commandes node
cli:
	docker-compose exec node bash
watch:
	docker-compose exec node npm run start
build: build-app
build-app:
	docker-compose exec -T node rm -rf build/*
	docker-compose exec -T node npm run build
analyze:
	docker-compose exec -T node npm run analyze
	xdg-open build/analyze.html

# Tests
test:
	docker-compose exec -T node npm run lint:check
	docker-compose exec -T node npm run test
test-watch:
	docker-compose exec node npm run test-watch

# Déploiement et installations
install:
	docker-compose exec -T node npm ci

get-bearer:
	@docker-compose exec -T node  sh -c "curl '$(REACT_APP_API_URL)' -sS -H 'content-type: application/json' -H 'site-reference: BOUTIQUE_VETERINAIRE' --data-binary '{\"query\":\"mutation{\n  LoginCustomer(email: \\\"$(BV_USER)\\\", password: \\\"$(BV_PASSWORD)\\\") {token}}\",\"variables\":null}' --compressed | jq .data.LoginCustomer.token -r"

apollo-schema-download: BEARER = $(shell make get-bearer)
apollo-schema-download:
	docker-compose exec -T node apollo schema:download schema.json --endpoint=$(REACT_APP_API_URL) --header="authorization: Bearer $(BEARER)"

apollo-client-extract: BEARER = $(shell make get-bearer)
apollo-client-extract:
	docker-compose exec -T node apollo client:extract manifest.json --endpoint=$(REACT_APP_API_URL) --header="authorization: Bearer $(BEARER)"

apollo-service-push: BEARER = $(shell make get-bearer)
apollo-service-push:
	docker-compose exec -T node apollo service:push --endpoint=$(REACT_APP_API_URL) --header="authorization: Bearer $(BEARER)"    
	
apollo-codegen: apollo-schema-download
apollo-codegen:
	docker-compose exec -T node apollo codegen:generate --localSchemaFile=schema.json --target=flow --includes=src/**/*.jsx --tagName=gql types
