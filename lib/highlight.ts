import { codeToHtml } from "shiki";

/**
 * Highlights code on the server using Shiki.
 * Returns semantic HTML with colors matching portfolio-v6.html:
 * keywords: #7FA1FF, strings: #F3B65B, comments: #6376A0, types/numbers: #6FE0B0
 */
export async function highlightCode(code: string, lang: string = "dart"): Promise<string> {
  if (!code) return "";
  try {
    const validLang = ["dart", "php", "typescript", "javascript", "json", "bash"].includes(lang)
      ? lang
      : "dart";

    const html = await codeToHtml(code, {
      lang: validLang,
      theme: "nord",
    });

    // Strip shiki wrapper pre/code to retain reference terminal styles
    const innerMatch = html.match(/<code>([\s\S]*?)<\/code>/);
    if (innerMatch && innerMatch[1]) {
      return innerMatch[1];
    }
    return html;
  } catch (err) {
    console.error("Shiki highlight error:", err);
    // Safe escape fallback
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
