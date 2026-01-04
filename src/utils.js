import crypto from "crypto";

export function normalizeHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function extractPrice(text) {
  const match = text.match(/(?:₹|\$)?\s?(\d{1,3}(?:,\d{3})*|\d+)/);
  if (!match) return null;
  return Number(match[1].replace(/,/g, ""));
}
