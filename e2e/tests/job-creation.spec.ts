import { test, expect } from '@playwright/test';

test.describe('Job Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should create a new job and verify it appears in the list with PENDING status', async ({ page }) => {
    const timestamp = Date.now();
    const jobName = `Test Job ${timestamp}`;

    const jobInput = page.getByTestId('new-job-name');
    await expect(jobInput).toBeVisible();
    await jobInput.fill(jobName);

    const createButton = page.getByTestId('create-job-btn');
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeEnabled();
    await createButton.click();

    await page.waitForTimeout(1000);

    const jobCards = page.locator('[data-testid^="job-row-"]');
    await expect(jobCards.first()).toBeVisible();

    const jobCard = page.locator(`text=${jobName}`).locator('..').locator('..');
    await expect(jobCard).toBeVisible();

    const statusBadge = jobCard.locator('[data-testid^="job-status-"]');
    await expect(statusBadge).toContainText('PENDING');

    await expect(jobCard).toContainText(jobName);
  });

  test('should not create job with empty name', async ({ page }) => {
    const createButton = page.getByTestId('create-job-btn');
    await expect(createButton).toBeVisible();
    await expect(createButton).toBeDisabled();
  });

  test('should create multiple jobs and verify they all appear', async ({ page }) => {
    const timestamp = Date.now();
    const jobNames = [
      `Job One ${timestamp}`,
      `Job Two ${timestamp}`,
      `Job Three ${timestamp}`,
    ];

    for (const jobName of jobNames) {
      const jobInput = page.getByTestId('new-job-name');
      await jobInput.fill(jobName);

      const createButton = page.getByTestId('create-job-btn');
      await createButton.click();

      await page.waitForTimeout(500);
    }

    for (const jobName of jobNames) {
      await expect(page.locator(`text=${jobName}`)).toBeVisible();
    }

    const jobCountText = page.locator('text=/\\(\\d+ of \\d+\\)/');
    await expect(jobCountText).toBeVisible();
  });

});
