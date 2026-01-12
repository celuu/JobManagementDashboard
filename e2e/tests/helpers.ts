import { Page, expect } from '@playwright/test';

/**
 * Helper function to create a job via the UI
 */
export async function createJob(page: Page, jobName: string) {
  const jobInput = page.getByTestId('new-job-name');
  await expect(jobInput).toBeVisible();
  await jobInput.fill(jobName);
  
  const createButton = page.getByTestId('create-job-btn');
  await expect(createButton).toBeVisible();
  await expect(createButton).toBeEnabled();
  await createButton.click();
  
  // Wait for the job to be created
  await page.waitForTimeout(1000);
}

/**
 * Helper function to verify a job exists with a specific status
 */
export async function verifyJobExists(page: Page, jobName: string, expectedStatus: string) {
  // Find the job card by its test ID that contains the job name
  const jobCard = page.locator('[data-testid^="job-row-"]').filter({ hasText: jobName });
  await expect(jobCard).toBeVisible();
  
  const statusBadge = jobCard.locator('[data-testid^="job-status-"]');
  await expect(statusBadge).toContainText(expectedStatus);
  
  return jobCard;
}

/**
 * Helper function to change job status via the UI
 */
export async function changeJobStatus(page: Page, jobName: string, newStatus: string) {
  // Find the job card by its test ID that contains the job name
  const jobCard = page.locator('[data-testid^="job-row-"]').filter({ hasText: jobName });
  await expect(jobCard).toBeVisible();
  
  // Click the edit icon
  const editButton = jobCard.locator('button[aria-label="Edit status"]');
  await expect(editButton).toBeVisible();
  await editButton.click();
  
  // Select new status
  const statusSelect = jobCard.locator('[data-testid^="status-select-"]');
  await expect(statusSelect).toBeVisible();
  await statusSelect.selectOption(newStatus);
  
  // Click confirm
  const confirmButton = jobCard.locator('button:has-text("Confirm")');
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();
  
  // Wait for status update
  await page.waitForTimeout(500);
}

/**
 * Helper function to delete a job via the UI (with confirmation)
 */
export async function deleteJob(page: Page, jobName: string, confirm: boolean = true) {
  // Find the job card by its test ID that contains the job name
  const jobCard = page.locator('[data-testid^="job-row-"]').filter({ hasText: jobName });
  await expect(jobCard).toBeVisible();
  
  // Wait for and click delete button
  const deleteButton = jobCard.locator('[data-testid^="delete-btn-"]');
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
  
  // Wait for modal to appear
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();
  
  if (confirm) {
    // Click confirm delete
    const confirmButton = modal.locator('button:has-text("Delete")');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    
    // Wait for deletion to complete
    await page.waitForTimeout(1000);
  } else {
    // Click cancel
    const cancelButton = modal.locator('button:has-text("Cancel")');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    
    // Wait for modal to close
    await page.waitForTimeout(500);
  }
}

/**
 * Helper function to verify a job does not exist
 */
export async function verifyJobNotExists(page: Page, jobName: string) {
  const jobCard = page.locator('[data-testid^="job-row-"]').filter({ hasText: jobName });
  await expect(jobCard).not.toBeVisible();
}

/**
 * Helper function to open delete confirmation modal
 */
export async function openDeleteModal(page: Page, jobName: string) {
  // Find the job card by its test ID that contains the job name
  const jobCard = page.locator('[data-testid^="job-row-"]').filter({ hasText: jobName });
  await expect(jobCard).toBeVisible();
  
  const deleteButton = jobCard.locator('[data-testid^="delete-btn-"]');
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();
  
  const modal = page.locator('[role="dialog"]');
  await expect(modal).toBeVisible();
  
  return modal;
}

/**
 * Generate unique job name with timestamp
 */
export function generateJobName(prefix: string = 'Test Job'): string {
  return `${prefix} ${Date.now()}`;
}
