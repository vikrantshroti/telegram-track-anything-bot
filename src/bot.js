import TelegramBot from "node-telegram-bot-api";
import { config } from "./config.js";
import { handleCommand } from "./commands.js";

export const bot = new TelegramBot(config.token, {
  polling: true,
});

bot.on("message", async (msg) => {
  if (!msg.text) return;
  if (msg.text.startsWith("/")) {
    await handleCommand(bot, msg);
  }
});
