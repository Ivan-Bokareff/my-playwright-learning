import { test, expect, type Page } from '@playwright/test';

const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';
const WRONG_PASS = 'wrong_password';

async function login(page: Page, username = VALID_USER, password = VALID_PASS) {
  await page.fill('input[placeholder="Username"]', username);
  await page.fill('input[placeholder="Password"]', password);
  await page.getByRole('button', { name: 'Login' }).click();
}

// ─── Login ────────────────────────────────────────────────────────────────────
test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Task 1 — valid login redirects to inventory page', async ({ page }) => {
    await login(page);
    await expect(page, 'Should redirect to inventory after valid login').toHaveURL(/inventory/);
  });

  test('Task 2 — wrong password shows error message', async ({ page }) => {
    await login(page, VALID_USER, WRONG_PASS);
    await expect(
      page.getByTestId('error'),
      'Error should appear for wrong credentials'
    ).toBeVisible();
    await expect(page, 'User should stay on login page').not.toHaveURL(/inventory/);
  });

  test('Task 2b — locked_out_user sees specific error message', async ({ page }) => {
  await login(page, 'locked_out_user', VALID_PASS);

  await expect(
    page.getByTestId('error'),
    'Locked out user should see specific error message'
  ).toHaveText('Epic sadface: Sorry, this user has been locked out.');
});

  test('Task 5a — empty form shows error', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(
      page.getByTestId('error'),
      'Error should appear when form is submitted empty'
    ).toBeVisible();
  });

  test('Task 5b — username only shows error', async ({ page }) => {
    await page.fill('input[placeholder="Username"]', VALID_USER);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(
      page.getByTestId('error'),
      'Error should appear when password is missing'
    ).toBeVisible();
  });

  test('Task 5c — password only shows error', async ({ page }) => {
    await page.fill('input[placeholder="Password"]', VALID_PASS);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(
      page.getByTestId('error'),
      'Error should appear when username is missing'
    ).toBeVisible();
  });
});

// ─── Cart ─────────────────────────────────────────────────────────────────────
test.describe('Cart', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await login(page);
    await expect(page, 'Should be on inventory before cart tests').toHaveURL(/inventory/);
  });

  test('Task 3 — adding a product shows badge "1"', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should show 1 after adding a product'
    ).toHaveText('1');
  });

  test('Task 4 — removing a product hides the cart badge', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should show 1 after adding'
    ).toHaveText('1');

    await page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart badge should not be visible after removing product'
    ).not.toBeVisible();
  });

  test('Task 7 — rapid add/remove/add cycle stays consistent', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(
      page.locator('.shopping_cart_badge'),
      'Badge should show 1 after first add'
    ).toHaveText('1');

    await page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(
      page.locator('.shopping_cart_badge'),
      'Badge should disappear after remove'
    ).not.toBeVisible();

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(
      page.locator('.shopping_cart_badge'),
      'After add→remove→add cycle, badge should show 1'
    ).toHaveText('1');
  });
});

// ─── Known bugs ───────────────────────────────────────────────────────────────
test.describe('Known bugs — problem_user', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await login(page, 'problem_user', VALID_PASS);
    await expect(page, 'Should be on inventory as problem_user').toHaveURL(/inventory/);
  });

  test('BUG — Remove button does not work for problem_user', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(
      page.locator('.shopping_cart_badge'),
      'Badge should show 1 after adding'
    ).toHaveText('1');

    await page.getByTestId('remove-sauce-labs-backpack').click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'BUG symptom 1: cart badge should disappear after Remove'
    ).not.toBeVisible();

    await expect(
      page.getByTestId('add-to-cart-sauce-labs-backpack'),
      'BUG symptom 2: button should return to Add to cart state after Remove'
    ).toBeVisible();
  });
});

// ─── Bonus ────────────────────────────────────────────────────────────────────
test.describe('Bonus', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await login(page);
    await expect(page, 'Should be on inventory before bonus tests').toHaveURL(/inventory/);
  });

  test('Bonus 1 — add 3 products, badge shows 3, remove one, badge shows 2', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
    await page.getByTestId('add-to-cart-sauce-labs-bolt-t-shirt').click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Badge should show 3 after adding 3 products'
    ).toHaveText('3');

    await page.getByTestId('remove-sauce-labs-backpack').click();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Badge should show 2 after removing one product'
    ).toHaveText('2');
  });

  test('Bonus 2 — sort by price low to high changes first product', async ({ page }) => {
    const firstProduct = page.locator('.inventory_item_name').first();
    const nameBeforeSort = await firstProduct.textContent();

    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    const nameAfterSort = await firstProduct.textContent();

    expect(nameAfterSort, 'First product should change after sorting').not.toBe(nameBeforeSort);
    expect(nameAfterSort, 'Cheapest product should be first after price sort').toBe('Sauce Labs Onesie');
  });

  test('Bonus 3 — cart keeps item after page refresh', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(
      page.locator('.shopping_cart_badge'),
      'Badge should show 1 before refresh'
    ).toHaveText('1');

    await page.reload();

    await expect(
      page.locator('.shopping_cart_badge'),
      'Cart should persist after page refresh'
    ).toHaveText('1');

    await page.locator('.shopping_cart_link').click();
    await expect(page, 'Should navigate to cart page').toHaveURL(/cart/);
    await expect(
      page.getByTestId('inventory-item-name'),
      'Product should still be in cart after refresh'
    ).toHaveText('Sauce Labs Backpack');
  });
});