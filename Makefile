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
	@echo "Building and starting services with Docker..."
	docker compose up -d --build

	@echo "Waiting for backend to be ready..."
	@sleep 5

	@echo "Running migrations..."
	docker compose exec backend python manage.py migrate

	@echo "Checking frontend dependencies..."
	@if [ ! -d "frontend/node_modules" ]; then \
		echo "Installing frontend dependencies..."; \
		cd frontend && (npm ci || npm install); \
	fi

	@echo "Checking E2E dependencies..."
	@if [ ! -d "e2e/node_modules" ]; then \
		echo "Installing E2E dependencies..."; \
		cd e2e && (npm ci || npm install); \
		echo "Installing Playwright browsers..."; \
		cd e2e && npx playwright install --with-deps; \
	fi

	@echo "Running Playwright E2E tests..."
	cd e2e && npm test

	@echo "Tests completed. Leaving services running (use 'make stop' to stop them)"
