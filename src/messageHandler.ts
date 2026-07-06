import "dotenv/config";
import { config } from "./config.js";
import TelegramClient from "./services/TelegramClient.js";
import RockPaperScissors from "./services/RockPaperScissors.js";
import Weather from "./services/Weather.js";
import { getStatus } from "./services/getStatus.js";

const bot = new TelegramClient(config.token);
const game = new RockPaperScissors();
const weather = new Weather(config.weatherKey);

const waitingForCity = new Set<number>();

function isCommand(text: string): boolean {
  return (
    text === "/start" ||
    text === "play" ||
    text === "status" ||
    text === "check weather" ||
    game.isChoice(text)
  );
}

export async function handleMessage(
  chatId: number,
  text: string
): Promise<void> {
  if (waitingForCity.has(chatId) && isCommand(text)) {
    waitingForCity.delete(chatId);
  }

  if (waitingForCity.has(chatId)) {
    waitingForCity.delete(chatId);

    try {
      const result = await weather.getWeather(text);

      await bot.sendMessage(chatId, result);

      if (result === "City not found.") {
        waitingForCity.add(chatId);
      }
    } catch {
      waitingForCity.add(chatId);
      await bot.sendMessage(chatId, "Cannot access weather. Check the city name");
    }

    return;
  }

  if (text === "/start") {
    await bot.sendKeyboard(chatId, "Hey there! What do you want to do?", [
      ["Play", "Check weather"],
      ["Status"],
    ]);
    return;
  }

  if (text === "play") {
    await bot.sendKeyboard(chatId, "Choose your option:", [
      ["Rock", "Scissors", "Paper"],
      ["Reset"],
    ]);
    return;
  }

  if (game.isChoice(text)) {
    const result = game.getResult(chatId, text);
    await bot.sendMessage(chatId, result);
    return;
  }

  if (text === "check weather") {
    waitingForCity.add(chatId);
    await bot.sendMessage(chatId, "Write your city:");
    return;
  }

  if (text === "status") {
    const status = await getStatus(chatId);
    await bot.sendMessage(chatId, status);
    return;
  }

  await bot.sendMessage(chatId, "I don't understand that command.");
}