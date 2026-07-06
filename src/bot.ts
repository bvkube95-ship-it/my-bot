import "dotenv/config"
import { config } from "./config.js"
import TelegramBot from "./TelegramBot.js"
import RockPaperScissors from "./RockPaperScissors.js"
import Weather from "./Weather.js"
import { trackMessage, getUser } from "./database.js"

const bot = new TelegramBot(config.token)
const game = new RockPaperScissors()
const weather = new Weather(config.weatherKey)

const waitingForCity = new Set<number>()

function isCommand(text: string): boolean {
  return (
      text === "/start" ||
      text === "play" ||
      text === "status" ||
      text === "check weather" ||
      game.isChoice(text)
    )
  }

async function handleMessage(chatId: number, text: string): Promise<void> {
  // If we waiting for the city but user types other commands
  if (waitingForCity.has(chatId) && isCommand(text)) {
    waitingForCity.delete(chatId)
  }

  if (waitingForCity.has(chatId)) {
    waitingForCity.delete(chatId)
    try {
      const result = await weather.getWeather(text)
      await bot.sendMessage(chatId, result)
      if (result === "City not found.") {
        waitingForCity.add(chatId)
      }
    } catch (e) {
      waitingForCity.add(chatId)
      await bot.sendMessage(chatId, "Cannot access weather. Check the city name")
    }
  } else if (text === "/start") {
    await bot.sendKeyboard(chatId, "Hey there! What do you want to do?", [["Play", "Check weather"], ["Status"]])
  } else if (text === "play") {
    await bot.sendKeyboard(chatId, "Choose your option:", [["Rock", "Scissors", "Paper"], ["Reset"]])
  } else if (game.isChoice(text)) {
    const result = game.getResult(chatId, text)
    await bot.sendMessage(chatId, result)
  } else if (text === "check weather") {
    waitingForCity.add(chatId)
    await bot.sendMessage(chatId, "Write your city:")
  } else if (text === "status") {
    const user = await getUser(chatId)
    if (!user) {
      await bot.sendMessage(chatId, "user not found")
      return
    }
    const date = new Date(user.first_seen)
    const formatted = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`
    await bot.sendMessage(chatId, `Name: ${user.first_name}\nUsername: @${user.username}\nMessages: ${user.message_count}\nWith us since: ${formatted}`)
  } else {
    await bot.sendMessage(chatId, "I don't understand that command.")
  }
}

async function polling(): Promise<void> {
  let offset = 0

  while (true) {
    try {
      const updates = await bot.getUpdates(offset)

      for (const update of updates) {
        offset = update.update_id + 1

        const message = update.message
        if (!message || !message.text) continue

        const chatId = message.chat.id
        const text = message.text.toLowerCase()
        const username = message.from?.username ?? "unknown"
        const firstName = message.from?.first_name ?? ""

        await trackMessage(chatId, username, firstName)
        await handleMessage(chatId, text)
      }
    } catch (e) {
      console.error("Error:", e)
    }
  }
}
polling()