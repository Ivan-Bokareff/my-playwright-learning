# Final Project — Playwright Test Suite

## Test target
SauceDemo (https://www.saucedemo.com)

## Covered user journey
Login → product selection → cart → checkout

## Test cases
- Valid user can log in and see inventory page
- Locked user cannot log in and sees correct error message
- Wrong password shows error message
- Empty form shows validation error
- Cart badge shows correct count after adding a product
- Cart page shows name of selected product
- Removing a product hides the cart badge
- Adding multiple products shows correct badge count
- User can complete checkout and see success message
- Overview page shows selected product before finishing

## Project structure
- `pages/` — Page Object classes (LoginPage, InventoryPage, CartPage, CheckoutPage)
- `tests/` — test specs (login.spec.ts, cart.spec.ts, checkout.spec.ts)
- `test-data/` — credentials and test inputs (users.ts)
- `playwright.config.ts` — configuration

## How to run
```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

## Notes
- No hard waits (`waitForTimeout`) are used
- Tests use semantic locators (`getByRole`, `getByTestId`, `getByPlaceholder`)
- Test data is stored separately from test logic in `test-data/users.ts`
- Checkout test uses `test.step` for readable HTML report output

## Known limitations
- `problem_user` bug is documented in `saucedemo.spec.ts` — Remove button does not work for this user
- Suite covers the critical path only — not all edge cases