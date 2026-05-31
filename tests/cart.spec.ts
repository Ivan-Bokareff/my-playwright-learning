import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { USERS } from "../test-data/users";

test.describe("Cart", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.open();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test("cart badge shows correct count after adding a product", async () => {
    await inventoryPage.addProductToCart("sauce-labs-backpack");

    await expect(
      inventoryPage.cartBadge,
      "Cart badge should show 1 after adding one product"
    ).toHaveText("1");
  });

  test("cart page shows name of selected product", async ({ page }) => {
    await inventoryPage.addProductToCart("sauce-labs-backpack");
    await inventoryPage.openCart();

    await expect(page).toHaveURL(/cart/);
    await expect(
      cartPage.itemName,
      "Cart should show the added product name"
    ).toHaveText("Sauce Labs Backpack");
  });

  test("removing a product hides the cart badge", async () => {
    await inventoryPage.addProductToCart("sauce-labs-backpack");
    await expect(inventoryPage.cartBadge).toHaveText("1");

    await inventoryPage.removeProductFromCart("sauce-labs-backpack");

    await expect(
      inventoryPage.cartBadge,
      "Cart badge should disappear after removing product"
    ).not.toBeVisible();
  });

  test("adding multiple products shows correct badge count", async () => {
    await inventoryPage.addProductToCart("sauce-labs-backpack");
    await inventoryPage.addProductToCart("sauce-labs-bike-light");

    await expect(
      inventoryPage.cartBadge,
      "Cart badge should show 2 after adding two products"
    ).toHaveText("2");
  });
});