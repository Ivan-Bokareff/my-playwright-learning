import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { USERS } from "../test-data/users";

test.describe("Login", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test("standard user can log in and see inventory page", async ({ page }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page, "Should redirect to inventory after login").toHaveURL(/inventory/);
  });

  test("locked user cannot log in and sees correct error", async () => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await expect(
      loginPage.errorMessage,
      "Locked user should see specific error"
    ).toHaveText("Epic sadface: Sorry, this user has been locked out.");
  });

  test("wrong password shows error message", async () => {
    await loginPage.login(USERS.standard.username, "wrong_password");
    await expect(
      loginPage.errorMessage,
      "Wrong password should show error"
    ).toBeVisible();
  });

  test("empty form shows validation error", async () => {
    await loginPage.loginButton.click();
    await expect(
      loginPage.errorMessage,
      "Empty form should show validation error"
    ).toBeVisible();
  });
});