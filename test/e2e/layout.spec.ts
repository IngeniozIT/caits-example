import { expect, test, type Page } from "@playwright/test";

const menu = (page: Page) => page.getByRole("navigation", { name: "Main menu" });

test("Given a visitor on the home page, When they open the example from the menu, Then the page of the example has the same menu, which marks the page that shows", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Code that stays clean.");
  await expect(menu(page).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");

  await menu(page).getByRole("link", { name: "Example" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Example");
  await expect(menu(page).getByRole("link", { name: "Example" })).toHaveAttribute("aria-current", "page");
  await expect(menu(page).getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
});

test("Given a visitor in the light theme, When they switch the theme, Then the pages show the dark theme, also after a reload, until they switch it back", async ({ page }) => {
  const html = page.locator("html");
  const darkMode = page.getByRole("button", { name: "Dark mode" });
  await page.goto("/");
  await expect(darkMode).toHaveAttribute("aria-pressed", "false");

  await darkMode.click();

  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.goto("/messages");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(darkMode).toHaveAttribute("aria-pressed", "true");

  await darkMode.click();

  await expect(html).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
});
