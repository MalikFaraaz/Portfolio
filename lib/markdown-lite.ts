/**
 * Converts **text** to <b>text</b> safely.
 * Disallows any raw HTML tags by escaping first.
 */
export function parseInlineBold(text: string): string {
  if (!text) return "";
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return escaped.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}
