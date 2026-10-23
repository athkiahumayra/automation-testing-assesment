const { expect } = require('@playwright/test');

async function login(page, username) {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
}

async function resetAppState(page) {
  const menuButton = page.locator('#react-burger-menu-btn');
  const resetLink = page.locator('#reset_sidebar_link');

  // Open the menu only if Reset App State is not visible.
  if (!(await resetLink.isVisible())) {
    await menuButton.click();
  }

  // Wait for the menu animation to finish.
  await resetLink.waitFor({ state: 'visible', timeout: 10000 });

  // Use the link only when it is visible.
  await resetLink.click();
}




async function resetAppStateAndLogout(page) {
  await resetAppState(page);

  const menuButton = page.locator('#react-burger-menu-btn');
  const logoutLink = page.locator('#logout_sidebar_link');

  if (!(await logoutLink.isVisible().catch(() => false))) {
    await menuButton.click();
  }
  if (await logoutLink.isVisible().catch(() => false)) {
    await logoutLink.click();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  }
}

module.exports = { expect, login, resetAppState, resetAppStateAndLogout };
