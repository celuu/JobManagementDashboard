# Job Management Dashboard

A full-stack web application for managing computational jobs with real-time status tracking, built with Django (backend), React + Chakra UI (frontend), and PostgreSQL (database).

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Docker** and **Docker Compose** (for backend and database)
- **Node.js** (v18 or higher) and **npm** (for frontend and E2E tests)

## 🚀 Quick Start (First Time Setup)

For first-time setup after cloning the repository:

```bash
make setup
```

This will:
- Build Docker images for backend and database
- Install frontend dependencies
- Install E2E test dependencies and Playwright browsers
- Start all services
- Run database migrations

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/schema/swagger-ui/

## 🛠️ Development Commands

### Start Services

```bash
make up          # Start all services (after initial setup)
```

### Stop Services

```bash
make stop        # Stop all services
make clean       # Stop services and remove volumes (fresh start)
```

### Run Tests

```bash
make test        # Run E2E tests with Playwright
```

The test command will:
- Start all services if not running
- Auto-install frontend and E2E dependencies if needed
- Run the full E2E test suite
- Leave services running for debugging

### View All Commands

```bash
make          # Show all available commands
```

### Manual Setup (Alternative)

If you prefer manual setup instead of using the Makefile:

```bash
# Build and start backend + database
docker compose up -d --build

# Wait for backend to be ready, then run migrations
docker compose exec backend python manage.py migrate

# In a separate terminal, install and start frontend
cd frontend
npm install
npm run dev

# In another terminal, install and run E2E tests
cd e2e
npm install
npx playwright install --with-deps
npm test
```

## 🧪 Running Tests

The project includes comprehensive E2E tests using Playwright:

```bash
make test
```

Tests include:
- Job creation flow
- Job status management
- Job deletion with confirmation
- Success/error handling
- Toast notifications

## 📁 Project Structure

```
.
├── backend/           # Django REST API
│   ├── jobs/         # Job management app
│   └── config/       # Django settings
├── frontend/         # React + Chakra UI
│   └── src/
│       ├── components/
│       └── api/
├── e2e/              # Playwright E2E tests
│   └── tests/
├── docker-compose.yml
└── Makefile          # Convenience commands
```

## 🎯 Features

- ✅ Create and manage jobs
- ✅ Real-time status tracking (PENDING, RUNNING, COMPLETED, FAILED)
- ✅ Pagination and filtering
- ✅ Delete with confirmation modal
- ✅ Success/error toast notifications
- ✅ Responsive UI with Chakra UI
- ✅ Comprehensive E2E test coverage

## 📝 API Endpoints

- `GET /api/jobs/` - List jobs (with pagination)
- `POST /api/jobs/` - Create a new job
- `GET /api/jobs/{id}/` - Get job details
- `PATCH /api/jobs/{id}/` - Update job status
- `DELETE /api/jobs/{id}/` - Delete a job

## 🔧 Technology Stack

- **Backend**: Django 5.1, Django REST Framework, PostgreSQL
- **Frontend**: React 18, TypeScript, Chakra UI, Vite
- **Testing**: Playwright
- **DevOps**: Docker, Docker Compose

---

# Christine Notes and Thought Process

