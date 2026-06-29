import "dotenv/config"
import { config } from "./config.js"
import TelegramBot from "./TelegramBot.js"
import RockPaperScissors from "./RockPaperScissors.js"
import Weather from "./Weather.js"

const bot = new TelegramBot(config.token)
const game = new RockPaperScissors()
const weather = new Weather(config.weatherKey)
const waitingForCity = new Set<number>()

async function polling(): Promise<void> {
  let offset = 0

  while (true) {
    try {
      const updates = await bot.getUpdates(offset)

      for (const update of updates) {
        offset = update.update_id + 1

        const message = update.message
        if (!message || !message.text) continue

        if (waitingForCity.has(message.chat.id)) {
          waitingForCity.delete(message.chat.id)
          try {
            const result = await weather.getWeather(message.text)
            await bot.sendMessage(message.chat.id, result)
            if (result === "City not found.") {
              waitingForCity.add(message.chat.id) 
            }
          } catch (e) {
            waitingForCity.add(message.chat.id)
            await bot.sendMessage(message.chat.id, "Cannot access weather. Check the city name")
          }
        }
          else if (message.text === "/start") {
            await bot.sendKeyboard(message.chat.id, "Hey there! What do you want to do?", [["Play", "Check weather"]])
        } else if (message.text === "Play") {
            await bot.sendKeyboard(message.chat.id, "Choose your option:", [["Rock", "Scissors", "Paper"]])
        } else if (game.isChoice(message.text)) {
            const result = game.getResult(message.chat.id, message.text)
            await bot.sendMessage(message.chat.id, result)
        } else if (message.text === "Check weather") {
            waitingForCity.add(message.chat.id)
            await bot.sendMessage(message.chat.id, "Write your city:")
        } else {
            await bot.sendMessage(message.chat.id, "I don't understand that command.")
        }
      }
    } catch (e) {
      console.error("Error:", e)
    }
    await new Promise(res => setTimeout(res, 1000))
  }
}
polling()