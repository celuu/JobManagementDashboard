import { test, expect } from '@playwright/test';
import { createJob, generateJobName } from './helpers';

test.describe('Job Deletion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should delete a job with confirmation modal', async ({ page }) => {
    const jobName = generateJobName('Delete Test');
    
    await createJob(page, jobName);
    await expect(page.locator(`text=${jobName}`)).toBeVisible();

    const jobCard = page.locator(`text=${jobName}`).locator('..').locator('..');
    const deleteButton = jobCard.locator('[data-testid^="delete-btn-"]');
    await deleteButton.click();

    await expect(page.locator('text=Delete Job')).toBeVisible();
    await expect(page.locator(`text=Are you sure you want to delete "${jobName}"?`)).toBeVisible();
    await expect(page.locator('text=This action cannot be undone')).toBeVisible();

    const confirmDeleteButton = page.locator('button:has-text("Delete")').last();
    await confirmDeleteButton.click();

    await page.waitForTimeout(1000);

    await expect(page.locator(`text=${jobName}`)).not.toBeVisible();
  });

  test('should cancel job deletion when clicking Cancel in modal', async ({ page }) => {
    const jobName = generateJobName('Cancel Delete');
    
    await createJob(page, jobName);
    await expect(page.locator(`text=${jobName}`)).toBeVisible();

    const jobCard = page.locator(`text=${jobName}`).locator('..').locator('..');
    const deleteButton = jobCard.locator('[data-testid^="delete-btn-"]');
    await deleteButton.click();

    await expect(page.locator('text=Delete Job')).toBeVisible();

    const cancelButton = page.locator('button:has-text("Cancel")').last();
    await cancelButton.click();

    await page.waitForTimeout(500);

    await expect(page.locator(`text=${jobName}`)).toBeVisible();
  });
});
