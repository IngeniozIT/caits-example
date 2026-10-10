import { expect, test, type Page } from "@playwright/test";

const menu = (page: Page) => page.getByRole("navigation", { name: "Main menu" });

test("Given a visitor, When they open the home page, Then the page has the menu, which marks the page that shows, and the title of the app", async ({ page }) => {
  await page.goto("/");

  await expect(menu(page).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  await expect(page).toHaveTitle("CAITS");
});

test("Given a visitor in the light theme, When they switch the theme, Then the page shows the dark theme, also after a reload, until they switch it back", async ({ page }) => {
  const html = page.locator("html");
  const darkMode = page.getByRole("button", { name: "Dark mode" });
  await page.goto("/");
  await expect(darkMode).toHaveAttribute("aria-pressed", "false");

  await darkMode.click();

  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(darkMode).toHaveAttribute("aria-pressed", "true");

  await darkMode.click();

  await expect(html).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Given a visitor who chose the dark theme, When the server sends the page, Then the page and the theme switch are dark before any script runs", async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: "theme", value: "dark", url: baseURL }]);

    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("button", { name: "Dark mode" })).toHaveAttribute("aria-pressed", "true");
  });
});
