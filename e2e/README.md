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
