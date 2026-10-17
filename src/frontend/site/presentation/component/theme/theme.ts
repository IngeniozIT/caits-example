/** The theme that the user chose with the theme switch, from the cookies of a request (its header Cookie): "light", "dark", or none. */
export function themeOf(cookies: string | null): string | undefined {
  return cookies?.match(/(?:^|;\s*)theme=(light|dark)(?=;|$)/)?.[1];
}

/** Whether the page is dark: the theme that the user chose, or else the theme of the system (systemIsDark), which only the browser knows. */
export function isDark(theme: string | undefined, systemIsDark: () => boolean): boolean {
  return theme ? theme === "dark" : systemIsDark();
}

/** The cookie that keeps the theme of the user a year, for every page of the app. */
export function themeCookie(theme: string): string {
  return `theme=${theme}; path=/; max-age=31536000; samesite=lax`;
}
