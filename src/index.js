import cron from "node-cron";
import { bot } from "./bot.js";
import { config } from "./config.js";
import { checkTrackers } from "./checker.js";

console.log("🤖 Track Anything Bot started (polling)");

cron.schedule(config.checkInterval, () => {
  checkTrackers(bot);
});
