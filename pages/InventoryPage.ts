import { type Locator, type Page } from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
    this.sortDropdown = page.getByTestId("product-sort-container");
  }

  async addProductToCart(productTestId: string) {
    await this.page.getByTestId(`add-to-cart-${productTestId}`).click();
  }

  async removeProductFromCart(productTestId: string) {
    await this.page.getByTestId(`remove-${productTestId}`).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }
}