import { describe, expect, test, vi } from "vitest";
import { copy, textToCopy } from "./clipboard.js";

describe("textToCopy", () => {
  test("the text of a command or a prompt has its spaces collapsed, and none around it", () => {
    expect(textToCopy("\n  Add  orders\n    next to messages.  ")).toBe("Add orders next to messages.");
  });
});

describe("copy", () => {
  test("writes the text to the clipboard, and tells that it did", async () => {
    const writeText = vi.fn(() => Promise.resolve());

    expect(await copy("npm run check", { writeText })).toBe(true);
    expect(writeText).toHaveBeenCalledWith("npm run check");
  });

  test("tells that the copy failed when the browser refuses it", async () => {
    expect(await copy("npm run check", { writeText: () => Promise.reject(new Error("Write permission denied.")) })).toBe(false);
  });

  test("tells that the copy failed when the page has no clipboard, as on plain HTTP", async () => {
    expect(await copy("npm run check", undefined)).toBe(false);
  });
});
