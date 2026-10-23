const { test, expect } = require('@playwright/test');
const { login, resetAppState, resetAppStateAndLogout } = require('./helpers');

test('Q2 - standard_user buys three products and verifies the order', async ({ page }) => {
  await login(page, 'standard_user');
  await expect(page).toHaveURL(/inventory\.html/);

  // Start with a clean cart/app state.
  await resetAppState(page);

  // Add any three products (the first three visible products are used).
  const cards = page.locator('.inventory_item');
  const count = await cards.count();
  expect(count).toBeGreaterThanOrEqual(3);

  const expectedProducts = [];
  let expectedSubtotal = 0;
  for (let i = 0; i < 3; i++) {
    const card = cards.nth(i);
    expectedProducts.push((await card.locator('.inventory_item_name').innerText()).trim());
    const priceText = await card.locator('.inventory_item_price').innerText();
    expectedSubtotal += Number(priceText.replace('$', ''));
    await card.locator('button').click();
  }

  await page.locator('.shopping_cart_link').click();
  await expect(page.locator('.cart_item')).toHaveCount(3);
  for (const productName of expectedProducts) {
    await expect(page.locator('.cart_item')).toContainText(productName);
  }

  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('Test');
  await page.locator('[data-test="lastName"]').fill('Student');
  await page.locator('[data-test="postalCode"]').fill('3100');
  await page.locator('[data-test="continue"]').click();

  await expect(page).toHaveURL(/checkout-step-two\.html/);
  for (const productName of expectedProducts) {
    await expect(page.locator('.cart_item')).toContainText(productName);
  }

  const displayedSubtotal = Number((await page.locator('.summary_subtotal_label').innerText()).replace('Item total: $', ''));
  expect(displayedSubtotal).toBeCloseTo(expectedSubtotal, 2);
  const tax = Number((await page.locator('.summary_tax_label').innerText()).replace('Tax: $', ''));
  const total = Number((await page.locator('.summary_total_label').innerText()).replace('Total: $', ''));
  expect(total).toBeCloseTo(displayedSubtotal + tax, 2);

  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');

  // Assignment requires resetting App State again and logging out.
  await page.locator('[data-test="back-to-products"]').click();
  await resetAppStateAndLogout(page);
});
