import { Page, expect } from '@playwright/test';

/**
 * Helper function to create a job via the UI
 */
export async function createJob(page: Page, jobName: string) {
  const jobInput = page.getByTestId('new-job-name');
  await jobInput.fill(jobName);
  
  const createButton = page.getByTestId('create-job-btn');
  await createButton.click();
  
  // Wait for the job to be created
  await page.waitForTimeout(1000);
}

/**
 * Helper function to verify a job exists with a specific status
 */
export async function verifyJobExists(page: Page, jobName: string, expectedStatus: string) {
  const jobCard = page.locator(`text=${jobName}`).locator('..').locator('..');
  await expect(jobCard).toBeVisible();
  
  const statusBadge = jobCard.locator('[data-testid^="job-status-"]');
  await expect(statusBadge).toContainText(expectedStatus);
  
  return jobCard;
}

/**
 * Helper function to change job status via the UI
 */
export async function changeJobStatus(page: Page, jobName: string, newStatus: string) {
  const jobCard = page.locator(`text=${jobName}`).locator('..').locator('..');
  
  // Click the edit icon
  const editButton = jobCard.locator('button[aria-label="Edit status"]');
  await editButton.click();
  
  // Select new status
  const statusSelect = jobCard.locator('[data-testid^="status-select-"]');
  await statusSelect.selectOption(newStatus);
  
  // Click confirm
  const confirmButton = jobCard.locator('button:has-text("Confirm")');
  await confirmButton.click();
  
  // Wait for status update
  await page.waitForTimeout(500);
}

/**
 * Generate unique job name with timestamp
 */
export function generateJobName(prefix: string = 'Test Job'): string {
  return `${prefix} ${Date.now()}`;
}
