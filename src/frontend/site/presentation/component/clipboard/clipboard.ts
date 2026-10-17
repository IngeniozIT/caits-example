/** The text that a button copies, from the text of an element of the page (content): a command or a prompt, its spaces collapsed. */
export function textToCopy(content: string): string {
  return content.replace(/\s+/g, " ").trim();
}

/**
 * Writes the text to the clipboard of the browser (navigator.clipboard), and tells whether it did. A page on plain HTTP has no
 * clipboard, and the browser can refuse the copy.
 */
export async function copy(text: string, clipboard: Pick<Clipboard, "writeText"> | undefined): Promise<boolean> {
  if (!clipboard) return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
