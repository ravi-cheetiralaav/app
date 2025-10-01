import { test, expect } from '@playwright/test';

// This test assumes the dev server is running at http://localhost:3000
// It performs the user story described by the user:
// 1) Visit /login and submit the CustomerLoginForm with user id Ravi_ST_132
// 2) After login, go to the home page (click logo)
// 3) Click "Treat Yourself" and expect to land on /customer/menu

test('logged-in treat yourself flow redirects to customer menu', async ({ page }) => {
  // 1 - login
  await page.goto('/login');
  // the CustomerLoginForm uses an input for 'userId' and a submit button - selectors may differ
  await page.fill('input[name="user_id"], input[name="userId"], input[type="text"]', 'Ravi_ST_132');
  await page.click('button[type="submit"]');

  // wait for navigation to dashboard or menu
  await page.waitForURL('**/customer/**', { timeout: 10000 });

  // 2 - go to home by clicking the logo
  await page.click('a[aria-label="Home"]');
  await expect(page).toHaveURL('/');

  // 3 - click Treat Yourself and expect to go to customer menu
  await page.click('text=Treat Yourself');
  await page.waitForURL('**/customer/menu', { timeout: 10000 });
  expect(page.url()).toContain('/customer/menu');
});
