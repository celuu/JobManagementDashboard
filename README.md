# Job Management Dashboard

A full-stack web application for managing computational jobs with real-time status tracking, built with Django (backend), React + Chakra UI (frontend), and PostgreSQL (database).

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js (v18+) and npm

### First-Time Setup

```bash
# Complete setup (install dependencies, build, start, and migrate)
make setup

# Or manually:
make install      # Install frontend and E2E dependencies
make build        # Build Docker images
make up           # Start the application
make migrate      # Run database migrations
```

The application will be available at:
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **Database**: localhost:5432

## 📋 Makefile Commands

### Core Commands

```bash
make build        # Build all Docker images
make up           # Start the application stack (detached mode)
make test         # Run Playwright E2E tests
make stop         # Stop all running Docker containers
make clean        # Remove Docker volumes and networks (with confirmation)
```

### Development Commands

```bash
make logs         # View logs from all services
make logs-backend # View backend logs only
make logs-db      # View database logs only
make restart      # Restart all services
make status       # Show status of all containers
make migrate      # Run Django migrations
make shell        # Open Django shell
make health       # Check application health
```

### Testing Commands

```bash
make test         # Run E2E tests (headless)
make test-ui      # Run E2E tests with Playwright UI
make test-headed  # Run E2E tests in headed mode (see browser)
make test-report  # View test report
```

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Django 5.x + Django REST Framework
- PostgreSQL 16
- Docker

**Frontend:**
- React 19
- TypeScript
- Chakra UI
- Vite

**Testing:**
- Playwright (E2E tests)

## 🎯 Features

### Job Management
- ✅ Create jobs with validation
- ✅ Update job status (PENDING → RUNNING → COMPLETED/FAILED)
- ✅ Delete jobs with confirmation modal
- ✅ Real-time status tracking
- ✅ Creation timestamps

### UI/UX
- ✅ Responsive grid layout (3 columns on desktop, 1 on mobile)
- ✅ Status badges with color coding
- ✅ Edit status with inline controls
- ✅ Confirmation modals for destructive actions
- ✅ Toast notifications
- ✅ Filter by status
- ✅ Sort by name, date, or status

### API Endpoints
- `GET /api/jobs/` - List all jobs
- `POST /api/jobs/` - Create a new job
- `PATCH /api/jobs/<id>/` - Update job status
- `DELETE /api/jobs/<id>/` - Delete a job

