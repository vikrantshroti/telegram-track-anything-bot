import axios from "axios";
import { normalizeHtml, hashContent, extractPrice } from "./utils.js";
import { getAllTrackers, updateTracker } from "./tracker.js";

export async function checkTrackers(bot) {
  const trackers = getAllTrackers();

  for (const t of trackers) {
    try {
      const res = await axios.get(t.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        timeout: 5000,
      });
      const content = normalizeHtml(res.data);

      if (t.type === "PAGE") {
        const h = hashContent(content);
        if (h !== t.lastHash) {
          await bot.sendMessage(t.chatId, `🔔 Page changed\n${t.url}`);
          t.lastHash = h;
        }
      }

      if (t.type === "KEYWORD") {
        const exists = content.includes(t.keyword);
        if (exists !== t.lastKeywordState) {
          await bot.sendMessage(
            t.chatId,
            `🔔 Keyword "${t.keyword}" ${exists ? "appeared" : "disappeared"}`
          );
          t.lastKeywordState = exists;
        }
      }

      if (t.type === "PRICE") {
        const price = extractPrice(content);
        if (price && price !== t.lastPrice) {
          await bot.sendMessage(
            t.chatId,
            `💰 Price changed!\n${t.lastPrice} → ${price}\n${t.url}`
          );
          t.lastPrice = price;
        }
      }

      t.lastCheckedAt = new Date().toISOString();
      updateTracker(t);
    } catch (err) {
      // silent failure
      if (err.response?.status === 403) {
        return bot.sendMessage(
          chatId,
          "❌ This website blocks bots (Amazon/Flipkart).\n" +
            "Try another site or use keyword tracking."
        );
      }

      return bot.sendMessage(chatId, "❌ Failed to track this URL.");
    }
  }
}
