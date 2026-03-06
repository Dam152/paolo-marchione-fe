import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage has no a11y violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h1');
    await page.evaluate(() => document.getAnimations().forEach((a) => a.finish()));

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
});
