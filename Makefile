.PHONY: build up test stop clean

build:
	docker compose build

up:
	docker compose up -d

stop:
	docker compose down

clean:
	docker compose down -v

test:
	docker compose up -d --build
	docker compose exec backend python manage.py migrate
	docker compose exec frontend npx playwright test
	docker compose down
