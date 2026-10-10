import { expect, test, type Page } from "@playwright/test";

const menu = (page: Page) => page.getByRole("navigation", { name: "Main menu" });
const messages = (page: Page) => page.getByRole("list", { name: "Messages" }).getByRole("listitem");
const add = async (page: Page, text: string) => {
  await page.getByLabel("New message").fill(text);
  await page.getByRole("button", { name: "Add" }).click();
};

// Each test starts with no message, also when it runs again: the server keeps the messages of the tests before.
test.beforeEach(async ({ request }) => {
  const { messages: kept } = (await (await request.get("/api/messages")).json()) as { messages: { id: string }[] };
  for (const { id } of kept) await request.delete(`/api/messages/${encodeURIComponent(id)}`);
});

test("Given a visitor on the home page, When they open the example from the menu, Then the page of the example shows, with its title, and the menu marks it", async ({ page }) => {
  await page.goto("/");

  await menu(page).getByRole("link", { name: "Example" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Example");
  await expect(page).toHaveTitle("Example · CAITS");
  await expect(menu(page).getByRole("link", { name: "Example" })).toHaveAttribute("aria-current", "page");
  await expect(menu(page).getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
});

test("Given a visitor on the page of the messages, When they add, edit and remove messages, Then the list shows each change, also after a reload", async ({ page }) => {
  await page.goto("/messages");
  await expect(page.getByText("No message yet.")).toBeVisible();

  await add(page, "Hello");
  await expect(messages(page)).toHaveText([/Hello/]);
  await expect(page.getByLabel("New message")).toHaveValue("");
  await add(page, "Bye");
  await expect(messages(page)).toHaveText([/Hello/, /Bye/]);

  await messages(page).filter({ hasText: "Hello" }).getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Text of the message").fill("Hello again");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(messages(page)).toHaveText([/Hello again/, /Bye/]);

  await messages(page).filter({ hasText: "Bye" }).getByRole("button", { name: "Remove" }).click();
  await expect(messages(page)).toHaveText([/Hello again/]);

  await page.reload();
  await expect(messages(page)).toHaveText([/Hello again/]);
});

test("Given a visitor on the page of the messages, When they add, edit and remove a message, Then the focus goes where they act next, and the status tells each change", async ({ page }) => {
  const status = page.getByRole("status");
  await page.goto("/messages");

  await add(page, "Hello");
  await expect(messages(page)).toHaveText([/Hello/]);
  await expect(page.getByLabel("New message")).toBeFocused();
  await expect(status).toHaveText("Message added.");

  await messages(page).getByRole("button", { name: "Edit" }).click();
  await expect(page.getByLabel("Text of the message")).toBeFocused();
  await page.getByLabel("Text of the message").fill("Hello again");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(messages(page)).toHaveText([/Hello again/]);
  await expect(messages(page).getByRole("button", { name: "Edit" })).toBeFocused();
  await expect(status).toHaveText("Message changed.");

  await messages(page).getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("No message yet.")).toBeVisible();
  await expect(page.getByLabel("New message")).toBeFocused();
  await expect(status).toHaveText("Message removed.");
});

test("Given a visitor on the page of the messages, When they add a message of spaces only, Then the page tells them why the domain refuses it", async ({ page }) => {
  await page.goto("/messages");

  await add(page, "   ");

  await expect(page.getByRole("alert")).toHaveText("A message cannot be empty.");
  await expect(page.getByLabel("New message")).toHaveValue("   ");
});
