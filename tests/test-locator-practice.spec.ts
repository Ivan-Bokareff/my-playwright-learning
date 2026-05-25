import { test, expect } from '@playwright/test';

test('Task 6 — найти элемент без id и data-testid', async ({ page }) => {
  // 1. Открываем сайт который выбрал
  await page.goto('https://github.com');

  // 2. Пишем локатор для найденного элемента
  const searchButton = page.getByRole('button', { name: 'Search' });

  // 3. Проверяем что он находится
  await expect(searchButton).toBeVisible();
});