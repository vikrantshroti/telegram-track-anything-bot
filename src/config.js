import dotenv from "dotenv";
dotenv.config();

export const config = {
  token: process.env.BOT_TOKEN,
  checkInterval: process.env.CHECK_INTERVAL || "*/15 * * * *",
};

if (!config.token) {
  throw new Error("BOT_TOKEN missing in .env");
}
