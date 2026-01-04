import axios from "axios";
import { addTracker, getUserTrackers, removeTracker } from "./tracker.js";
import { normalizeHtml, hashContent, extractPrice } from "./utils.js";

export async function handleCommand(bot, msg) {
  const chatId = msg.chat.id;
  const parts = msg.text.split(" ");
  const cmd = parts[0];

  try {
    switch (cmd) {
      case "/start":
        return bot.sendMessage(
          chatId,
          "👋 Track Anything Bot\n\n" +
            "/track <url>\n" +
            "/track keyword <url> <word>\n" +
            "/track price <url>\n" +
            "/list\n/remove <id>"
        );

      case "/track": {
        const type = parts[1];

        // PAGE
        if (!type || type.startsWith("http")) {
          const url = type;
          const res = await axios.get(url, { timeout: 5000 });
          const content = normalizeHtml(res.data);

          const tracker = addTracker({
            chatId,
            url,
            type: "PAGE",
            lastHash: hashContent(content),
          });

          return bot.sendMessage(
            chatId,
            `✅ Page tracking started\nID: ${tracker.id}`
          );
        }

        // KEYWORD
        if (type === "keyword") {
          const url = parts[2];
          const keyword = parts.slice(3).join(" ");

          const res = await axios.get(url, { timeout: 5000 });
          const content = normalizeHtml(res.data);
          const exists = content.includes(keyword);

          const tracker = addTracker({
            chatId,
            url,
            type: "KEYWORD",
            keyword,
            lastKeywordState: exists,
          });

          return bot.sendMessage(
            chatId,
            `✅ Keyword tracking started\n"${keyword}"\nID: ${tracker.id}`
          );
        }

        // PRICE
        if (type === "price") {
          const url = parts[2];

          const res = await axios.get(url, { timeout: 5000 });
          const content = normalizeHtml(res.data);
          const price = extractPrice(content);

          if (!price) {
            return bot.sendMessage(chatId, "❌ Could not detect price");
          }

          const tracker = addTracker({
            chatId,
            url,
            type: "PRICE",
            lastPrice: price,
          });

          return bot.sendMessage(
            chatId,
            `✅ Price tracking started\nCurrent price: ${price}\nID: ${tracker.id}`
          );
        }

        return bot.sendMessage(chatId, "❓ Invalid /track command");
      }

      case "/list": {
        const trackers = getUserTrackers(chatId);
        if (!trackers.length) return bot.sendMessage(chatId, "No trackers");

        return bot.sendMessage(
          chatId,
          trackers
            .map((t) => `🆔 ${t.id}\n🔗 ${t.url}\n📌 ${t.type}`)
            .join("\n\n")
        );
      }

      case "/remove":
        const ok = removeTracker(chatId, parts[1]);
        return bot.sendMessage(chatId, ok ? "❌ Removed" : "Not found");

      default:
        return bot.sendMessage(chatId, "Unknown command");
    }
  } catch (err) {
    console.error("TRACK ERROR:", err);
    bot.sendMessage(
      chatId,
      "❌ Error processing request:\n" + (err.message || "Unknown error")
    );
  }
}
