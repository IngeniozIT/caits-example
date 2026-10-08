import { expect, test } from "@playwright/test";

test("Given a visitor on the home page, When they copy the prompt for an AI agent, Then the clipboard holds the prompt, and the button tells it", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const copy = page.getByRole("button", { name: "Copy the prompt" });

  await copy.click();

  await expect(copy).toHaveText("Copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "Add orders next to messages, in the backend and the frontend, with the use case place-order. Follow the shape of messages. Run npm run check until it passes."
  );
});

test("Given a visitor on the home page, When they copy a command, Then the clipboard holds the command alone", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  await page.getByRole("button", { name: "Copy npm run build && npm start" }).click();

  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("npm run build && npm start");
});
