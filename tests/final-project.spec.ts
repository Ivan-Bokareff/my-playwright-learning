import { test, expect, type Page } from '@playwright/test';

const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';
const LOCKED_USER = 'locked_out_user';

async function login(page: Page, username = VALID_USER, password = VALID_PASS) {
  await page.fill('input[placeholder="Username"]', username);
  await page.fill('input[placeholder="Password"]', password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.describe('SauceDemo — Critical Path', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Test 1 — Valid login
  test('1 — valid user can log in and see inventory page', async ({ page }) => {
    await login(page);

    await expect(
      page,
      'Should redirect to inventory after valid login'
    ).toHaveURL(/inventory/);
  });

  // Test 2 — Locked user
  test('2 — locked user cannot log in and sees correct error', async ({ page }) => {
    await login(page, LOCKED_USER, VALID_PASS);

    await expect(
      page.getByTestId('error'),
      'Locked user should see specific error message'
    ).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  // Test 3 — Add two products
  test('3 — user can add two products and verify badge count', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/inventory/);

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should show 2 after adding two products'
    ).toHaveText('2');
  });

  // Test 4 — Remove one product
  test('4 — user can remove one product and cart updates', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/inventory/);

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await page.getByTestId('remove-sauce-labs-backpack').click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should show 1 after removing one product'
    ).toHaveText('1');
  });

  // Test 5 — Complete checkout
  test('5 — user can complete checkout and see success message', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/inventory/);

    // Add a product
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

    // Go to cart
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart/);

    // Start checkout
    await page.getByTestId('checkout').click();
    await expect(page).toHaveURL(/checkout-step-one/);

    // Fill in delivery details
    await page.getByTestId('firstName').fill('Ivan');
    await page.getByTestId('lastName').fill('Bokareff');
    await page.getByTestId('postalCode').fill('12345');
    await page.getByTestId('continue').click();

    // Review order
    await expect(page).toHaveURL(/checkout-step-two/);
    await page.getByTestId('finish').click();

    // Verify success
    await expect(page).toHaveURL(/checkout-complete/);
    await expect(
      page.getByTestId('complete-header'),
      'Should show order confirmation message'
    ).toHaveText('Thank you for your order!');
  });
});