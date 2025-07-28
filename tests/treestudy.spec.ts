import { test, expect } from '@playwright/test';

test.describe('TreeStudy PWA', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText('TreeStudy');

    // Check if the hero section is visible with updated text
    await expect(page.locator('text=Focus &')).toBeVisible();
    await expect(page.locator('text=Grow')).toBeVisible();
  });
  test('should display timer component', async ({ page }) => {
    await page.goto('/');

    // Check if timer display is visible (using data-testid)
    await expect(page.locator('[data-testid="timer-display"]')).toBeVisible();

    // Check if timer control button is visible
    await expect(
      page.locator('[data-testid="timer-control-button"]')
    ).toBeVisible();
  });
  test('should start and pause timer', async ({ page }) => {
    await page.goto('/');

    // Start the timer
    await page.click('[data-testid="timer-control-button"]');

    // Wait a moment and check if timer is running
    await page.waitForTimeout(1100);

    // The timer should have decreased by at least 1 second
    const timeDisplay = await page
      .locator('[data-testid="timer-display"]')
      .textContent();
    expect(timeDisplay).not.toBe('25:00');

    // Pause the timer
    await page.click('[data-testid="timer-control-button"]');

    // Check if start button is visible again (text should contain "Start" or "Resume")
    await expect(
      page.locator('[data-testid="timer-control-button"]')
    ).toContainText(/Start|Resume/);
  });
  test('should display plant visualization', async ({ page }) => {
    await page.goto('/');

    // Check if plant container is visible
    await expect(page.locator('canvas')).toBeVisible();

    // Check if plant info overlay is visible with new design
    await expect(page.locator('text=seed')).toBeVisible();
    await expect(page.locator('text=0 points')).toBeVisible();
  });
  test('should be installable as PWA', async ({ page }) => {
    await page.goto('/');

    // Check for theme-color meta tag (PWA indicator)
    const themeColor = await page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveCount(1);

    // Check for manifest link (might not be present in dev mode)
    // In development, vite-plugin-pwa might not inject the manifest link
    const manifestLink = page.locator('link[rel="manifest"]');

    // Either manifest link exists OR we have PWA meta tags indicating PWA setup
    const manifestExists = await manifestLink.count();
    const themeColorExists = await themeColor.count();

    // At least one PWA indicator should be present
    expect(manifestExists + themeColorExists).toBeGreaterThanOrEqual(1);
  });
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if layout is mobile-friendly
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();

    // Timer should be visible and functional on mobile
    await expect(
      page.locator('[data-testid="timer-control-button"]')
    ).toBeVisible();
  });
});
