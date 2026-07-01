import "dotenv/config"
import "./database.js"
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
      text === "Play" ||
      text === "Status" ||
      text === "Check weather" ||
      game.isChoice(text)
    )
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
        const text = message.text
        const username = message.from?.username ?? "unknown"
        const firstName = message.from?.first_name ?? ""

        await trackMessage(chatId, username, firstName)

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
          await bot.sendKeyboard(chatId, "Hey there! What do you want to do?", [["Play", "Check weather", "Status"]])
        } else if (text === "Play") {
          await bot.sendKeyboard(chatId, "Choose your option:", [["Rock", "Scissors", "Paper"]])
        } else if (game.isChoice(text)) {
          const result = game.getResult(chatId, text)
          await bot.sendMessage(chatId, result)
        } else if (text === "Check weather") {
          waitingForCity.add(chatId)
          await bot.sendMessage(chatId, "Write your city:")
        } else if (text === "Status") {
          const user = await getUser(chatId)
          await bot.sendMessage(chatId, `Name: ${user.first_name}\nUsername: @${user.username}\nMessages: ${user.message_count}`)
        } else {
          await bot.sendMessage(chatId, "I don't understand that command.")
        }
      }
    } catch (e) {
      console.error("Error:", e)
    }
    await new Promise(res => setTimeout(res, 1000))
  }
}
polling()