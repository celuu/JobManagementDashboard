import { test, expect } from '@playwright/test';
import { 
  createJob, 
  verifyJobExists, 
  changeJobStatus,
  generateJobName,
} from './helpers';

test.describe('Job Status Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should update job status from PENDING to RUNNING', async ({ page }) => {
    const jobName = generateJobName('Status Update');
    
    await createJob(page, jobName);
    await verifyJobExists(page, jobName, 'PENDING');
    
    await changeJobStatus(page, jobName, 'RUNNING');
    await verifyJobExists(page, jobName, 'RUNNING');
  });

  test('should update job status to COMPLETED', async ({ page }) => {
    const jobName = generateJobName('Complete Job');
    
    await createJob(page, jobName);
    await changeJobStatus(page, jobName, 'COMPLETED');
    await verifyJobExists(page, jobName, 'COMPLETED');
  });

  test('should update job status to FAILED', async ({ page }) => {
    const jobName = generateJobName('Failed Job');
    
    await createJob(page, jobName);
    await changeJobStatus(page, jobName, 'FAILED');
    await verifyJobExists(page, jobName, 'FAILED');
  });

  test('should handle multiple status changes', async ({ page }) => {
    const jobName = generateJobName('Multi Status');
    
    await createJob(page, jobName);
    
    await changeJobStatus(page, jobName, 'RUNNING');
    await verifyJobExists(page, jobName, 'RUNNING');
    
    await changeJobStatus(page, jobName, 'COMPLETED');
    await verifyJobExists(page, jobName, 'COMPLETED');
    
    await changeJobStatus(page, jobName, 'FAILED');
    await verifyJobExists(page, jobName, 'FAILED');
  });
});
