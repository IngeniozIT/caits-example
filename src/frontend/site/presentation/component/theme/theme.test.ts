import { describe, expect, test } from "vitest";
import { isDark, themeCookie, themeOf } from "./theme.js";

describe("themeOf", () => {
  test.for([
    ["theme=dark", "dark"],
    ["lang=en; theme=light; seen=1", "light"],
    ["lang=en;theme=dark", "dark"]
  ])("the cookies %s give the theme %s", ([cookies, theme]) => {
    expect(themeOf(cookies)).toBe(theme);
  });

  test.for([
    ["no cookie", null],
    ["no cookie theme", "lang=en"],
    ["a cookie whose name ends with theme", "mytheme=dark"],
    ["a theme that the app does not have", "theme=blue"],
    ["a theme that starts as one of the app", "theme=darker"]
  ])("%s gives no theme", ([, cookies]) => {
    expect(themeOf(cookies)).toBeUndefined();
  });
});

describe("isDark", () => {
  test.for([
    ["dark", false, true],
    ["light", true, false],
    [undefined, true, true],
    [undefined, false, false]
  ] as const)("the theme %s, on a system dark: %s, is dark: %s", ([theme, system, dark]) => {
    expect(isDark(theme, () => system)).toBe(dark);
  });
});

describe("themeCookie", () => {
  test("keeps the theme a year, for every page", () => {
    expect(themeCookie("dark")).toBe("theme=dark; path=/; max-age=31536000; samesite=lax");
  });
});
