import { type Locator, type Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly itemName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByTestId("checkout");
    this.itemName = page.getByTestId("inventory-item-name");
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}