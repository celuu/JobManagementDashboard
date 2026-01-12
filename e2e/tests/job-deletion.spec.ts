import { test, expect } from '@playwright/test';
import { 
  createJob, 
  verifyJobExists, 
  generateJobName,
  deleteJob,
  verifyJobNotExists,
  openDeleteModal,
} from './helpers';

test.describe('Job Deletion Flow', () => {
  test.beforeEach(async ({ page, browserName }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    if (browserName !== 'firefox') {
      await page.waitForLoadState('networkidle', { timeout: 10_000 });
    }
  });

  test('should successfully delete a single job', async ({ page }) => {
    const jobName = generateJobName('Delete Test');
    
    await createJob(page, jobName);
    await verifyJobExists(page, jobName, 'PENDING');
    
    const modal = await openDeleteModal(page, jobName);
    
    await expect(modal).toContainText('Delete Job');
    await expect(modal).toContainText(`Are you sure you want to delete "${jobName}"?`);
    await expect(modal).toContainText('This action cannot be undone');
    
    const confirmButton = modal.locator('button:has-text("Delete")');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    
    await page.waitForTimeout(1000);
    
    await verifyJobNotExists(page, jobName);
  });

  test('should cancel job deletion when clicking cancel button', async ({ page }) => {
    const jobName = generateJobName('Cancel Delete');
    
    await createJob(page, jobName);
    await verifyJobExists(page, jobName, 'PENDING');
    
    await deleteJob(page, jobName, false);
    
    await verifyJobExists(page, jobName, 'PENDING');
  });

  test('should show success toast after deletion', async ({ page }) => {
    const jobName = generateJobName('Toast Test');
    
    await createJob(page, jobName);
    await verifyJobExists(page, jobName, 'PENDING');
    
    await deleteJob(page, jobName);
    
    await page.waitForTimeout(500);
    const toast = page.locator('[role="status"]', { hasText: 'Success' });
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(`Job "${jobName}" deleted successfully`);
    
    await verifyJobNotExists(page, jobName);
  });

  test('should update job count after deletion', async ({ page }) => {
    const jobName1 = generateJobName('Count Test 1');
    const jobName2 = generateJobName('Count Test 2');
    
    await createJob(page, jobName1);
    await createJob(page, jobName2);
    
    const countBefore = await page.locator('text=/\\(\\d+ of \\d+\\)/').textContent();
    expect(countBefore).toBeTruthy();
    
    await deleteJob(page, jobName1);
    
    const countAfter = await page.locator('text=/\\(\\d+ of \\d+\\)/').textContent();
    expect(countAfter).toBeTruthy();
    expect(countAfter).not.toBe(countBefore);
  });

  test('should close modal after successful deletion', async ({ page }) => {
    const jobName = generateJobName('Loading State');
    
    await createJob(page, jobName);
    await verifyJobExists(page, jobName, 'PENDING');
    
    const modal = await openDeleteModal(page, jobName);
    
    const confirmButton = modal.locator('button:has-text("Delete")');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    
    await page.waitForTimeout(1000);
    await expect(modal).not.toBeVisible();
    
    await verifyJobNotExists(page, jobName);
  });
});
