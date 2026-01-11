# End-to-End Tests

This directory contains Playwright end-to-end tests for the Job Management Dashboard.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Using Makefile (Recommended)

From the project root:

```bash
# Run all tests (headless)
make test

# Run tests with UI mode (interactive)
make test-ui

# Run tests in headed mode (see browser)
make test-headed

# View test report
make test-report
```

### Using npm directly

From the `e2e` directory:

```bash
# Run all tests (headless)
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run report
```

## Test Coverage

### Job Creation (`tests/job-creation.spec.ts`) - 5 tests

Tests the job creation workflow:

1. **Create job and verify PENDING status** - Creates a new job and verifies it appears with PENDING status
2. **Empty name validation** - Verifies that the Create button is disabled when input is empty
3. **Multiple job creation** - Creates multiple jobs and verifies they all appear
4. **Input clearing** - Verifies the input field is cleared after successful creation
5. **Timestamp display** - Verifies the "Created at" timestamp is shown correctly

### Job Deletion (`tests/job-deletion.spec.ts`) - 5 tests

Tests the job deletion workflow with confirmation modal:

1. **Delete with confirmation** - Tests the complete deletion flow with modal confirmation
2. **Cancel deletion** - Verifies job is not deleted when clicking Cancel
3. **Close modal with X** - Verifies job is not deleted when closing modal with X button
4. **Multiple deletions** - Tests deleting multiple jobs independently
5. **Success toast** - Verifies success message appears after deletion

### Job Status Management (`tests/job-status.spec.ts`) - 6 tests

Tests the status update workflow:

1. **Update to RUNNING** - Changes job status from PENDING to RUNNING
2. **Update to COMPLETED** - Changes job status to COMPLETED
3. **Update to FAILED** - Changes job status to FAILED
4. **Multiple status changes** - Tests sequential status updates
5. **Edit UI elements** - Verifies edit icon, dropdown, and confirm/cancel buttons
6. **Cancel status change** - Verifies status doesn't change when cancelled

### Job Filtering and Sorting (`tests/job-filtering.spec.ts`) - 11 tests

Tests filtering and sorting functionality:

1. **Filter by PENDING** - Shows only pending jobs
2. **Filter by RUNNING** - Shows only running jobs
3. **Filter by COMPLETED** - Shows only completed jobs
4. **Filter ALL** - Shows all jobs regardless of status
5. **Sort by name (A-Z)** - Alphabetical ascending order
6. **Sort by name (Z-A)** - Alphabetical descending order
7. **Sort by newest** - Most recent jobs first
8. **Sort by oldest** - Oldest jobs first
9. **Job count display** - Shows correct count of visible jobs
10. **Count updates with filter** - Count reflects filtered results
11. **No results message** - Shows message when filter matches no jobs

## Prerequisites

Before running tests, ensure:

1. Backend server is running on `http://localhost:8000` (or update the API URL in frontend)
2. Frontend dev server will be automatically started by Playwright on `http://localhost:5173`

## Configuration

The Playwright configuration is in `playwright.config.ts`. Key settings:

- **baseURL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit
- **Auto web server**: Automatically starts the frontend dev server

## Writing New Tests

Place new test files in the `tests/` directory with the `.spec.ts` extension.

Example:
```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  await page.goto('/');
  // Your test code here
});
```

## Test Selectors

The application uses `data-testid` attributes for stable test selectors:

- `new-job-name` - Job name input field
- `create-job-btn` - Create job button
- `job-row-{id}` - Individual job card
- `job-status-{id}` - Job status badge
- `status-select-{id}` - Status dropdown
- `delete-btn-{id}` - Delete button

## CI/CD Integration

To run tests in CI:

```bash
npm test -- --reporter=github
```

The tests are configured to:
- Run with 2 retries in CI
- Use single worker in CI
- Generate HTML reports
