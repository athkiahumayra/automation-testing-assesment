const { test, expect } = require('@playwright/test');
const { login, resetAppState, resetAppStateAndLogout } = require('./helpers');

test('Q3 - performance_glitch_user sorts Z to A and buys the first product', async ({ page }) => {
  await login(page, 'performance_glitch_user');
  await expect(page).toHaveURL(/inventory\.html/);

  // Reset app state as requested.
  await resetAppState(page);

  // Name (Z to A) is the option value za.
  await page.locator('[data-test="product-sort-container"]').selectOption('za');

  const firstCard = page.locator('.inventory_item').first();
  const expectedName = (await firstCard.locator('.inventory_item_name').innerText()).trim();
  const expectedPrice = Number((await firstCard.locator('.inventory_item_price').innerText()).replace('$', ''));
  await firstCard.locator('button').click();

  await page.locator('.shopping_cart_link').click();
  await expect(page.locator('.cart_item')).toHaveCount(1);
  await expect(page.locator('.cart_item')).toContainText(expectedName);

  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('Test');
  await page.locator('[data-test="lastName"]').fill('Student');
  await page.locator('[data-test="postalCode"]').fill('3100');
  await page.locator('[data-test="continue"]').click();

  await expect(page).toHaveURL(/checkout-step-two\.html/);
  await expect(page.locator('.cart_item')).toContainText(expectedName);

  const subtotal = Number((await page.locator('.summary_subtotal_label').innerText()).replace('Item total: $', ''));
  expect(subtotal).toBeCloseTo(expectedPrice, 2);
  const tax = Number((await page.locator('.summary_tax_label').innerText()).replace('Tax: $', ''));
  const total = Number((await page.locator('.summary_total_label').innerText()).replace('Total: $', ''));
  expect(total).toBeCloseTo(subtotal + tax, 2);

  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');

  await page.locator('[data-test="back-to-products"]').click();
  await resetAppStateAndLogout(page);
});
