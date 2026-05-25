Тест 1:
Root cause: placeholder "User Name" не существует на странице — реальный placeholder "Username"
Fix: getByPlaceholder("User Name") → getByPlaceholder("Username")
How I verified: npx playwright test tests/broken-tests.spec.ts --headed — тест прошёл

Тест 2:
Root cause: toHaveText требует точное совпадение, а в тесте был написан только фрагмент 
           реального текста ошибки — без префикса "Epic sadface:"
Fix: "Username and password do not match" → 
     "Epic sadface: Username and password do not match any user in this service"
How I verified: npx playwright test tests/broken-tests.spec.ts --headed — тест прошёл

Тест 3:
Root cause: отсутствовал await перед page.locator().click() — Playwright запускал клик 
           но не ждал его завершения и сразу переходил к проверке бейджа
Fix: page.locator(...).click() → await page.locator(...).click()
How I verified: npx playwright test tests/broken-tests.spec.ts --headed — тест прошёл