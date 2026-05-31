import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { USERS, CHECKOUT_INFO } from "../test-data/users";

test.describe("Checkout", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test("user can complete checkout and see success message", async ({ page }) => {
    await test.step("Add product to cart", async () => {
      await inventoryPage.addProductToCart("sauce-labs-backpack");
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });

    await test.step("Open cart and start checkout", async () => {
      await inventoryPage.openCart();
      await expect(page).toHaveURL(/cart/);
      await cartPage.checkout();
      await expect(page).toHaveURL(/checkout-step-one/);
    });

    await test.step("Fill in delivery details", async () => {
      await checkoutPage.fillInfo(
        CHECKOUT_INFO.firstName,
        CHECKOUT_INFO.lastName,
        CHECKOUT_INFO.postalCode
      );
      await expect(page).toHaveURL(/checkout-step-two/);
    });

    await test.step("Complete order and verify success", async () => {
      await checkoutPage.finish();
      await expect(page).toHaveURL(/checkout-complete/);
      await expect(
        checkoutPage.successMessage,
        "Should show order confirmation message"
      ).toHaveText("Thank you for your order!");
    });
  });

  test("overview page shows selected product before finishing", async ({ page }) => {
    await inventoryPage.addProductToCart("sauce-labs-backpack");
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );

    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(
      page.getByTestId("inventory-item-name"),
      "Overview should show the selected product"
    ).toHaveText("Sauce Labs Backpack");
  });
});