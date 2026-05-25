// This is an example test file using Playwright with TypeScript. 
// It contains two tests: one to check the title of the page 
// and another to verify the functionality of a link on the page.


import { test, expect } from '@playwright/test'; // Importing the test and expect functions

test('has title', async ({ page }) => {          // Test to check if the page has the correct title
  await page.goto('https://playwright.dev/');    // Navigate to the Playwright website

  await expect(page).toHaveTitle(/Playwright/);  // To check if the title contains the word "Playwright"
});

test('get started link', async ({ page }) => {   // Test to check if the "Get started" link works correctly
  await page.goto('https://playwright.dev/');    // Navigate to the Playwright website

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
