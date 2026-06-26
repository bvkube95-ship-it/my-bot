import "dotenv/config"
import type { Update } from "./types.js"
import { config } from "./config.js"

const API = `https://api.telegram.org/bot${config.token}`

async function getUpdates(offset: number): Promise<Update[]> {
  const response = await fetch(`${API}/getUpdates?offset=${offset}`)
  const data = await response.json()
  return data.result
}

async function sendMessage(chatId: number, text: string): Promise<void> {
  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  })
}

async function polling(): Promise<void> {
  let offset = 0
  const scores: Record<number, { wins: number, losses: number, draws: number }> = {}

  while (true) {
    try {
      const updates = await getUpdates(offset)

      for (const update of updates) {
        offset = update.update_id + 1

        const message = update.message
        if (!message || !message.text) continue

        if (message.text === "/start") {
          await fetch(`${API}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: message.chat.id,
              text: "No co z tym '/start', człowieku? Co chcesz?",
              reply_markup: {
                keyboard: [["Grać", "Вариант 2"]],
                resize_keyboard: true
              }
            })
          })
        }

        if (message.text === "Grać") {
          await fetch(`${API}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: message.chat.id,
              text: "No wybieraj:",
              reply_markup: {
                keyboard: [["Kamień", "Nożyczki", "Papierz"]],
                resize_keyboard: true
              }
            })
          })
        }

        const choices = ["Kamień", "Nożyczki", "Papierz"]

        if (choices.includes(message.text)) {
          const chatId = message.chat.id

          if (!scores[chatId]) {
            scores[chatId] = { wins: 0, losses: 0, draws: 0 }
          }

          const userChoice = message.text
          const botChoice = choices[Math.floor(Math.random() * 3)]
          const score = scores[chatId]

          if (userChoice === "Kamień") {
            if (botChoice === "Kamień") {
              score.draws++
              await sendMessage(message.chat.id, `Wygrane: ${score.wins}. Przegrane: ${score.losses}. Remisy: ${score.draws}\nTy: Kamień\nJa: Kamień\nNo nic`)
            } else if (botChoice === "Nożyczki") {
              score.wins++
              await sendMessage(message.chat.id, `Wygrane: ${score.wins}. Przegrane: ${score.losses}. Remisy: ${score.draws}\nTy: Kamień\nJa: Nożyczki\nJesteś pojebany (mocno)`)
            } else {
              score.losses++
              await sendMessage(message.chat.id, `Wygrane: ${score.wins}. Przegrane: ${score.losses}. Remisy: ${score.draws}\nTy: Kamień\nJa: Papierz\nKurwa... spierdalaj`)
            }
          } else if (userChoice === "Nożyczki") {
            if (botChoice === "Nożyczki") {
              score.draws++
              await sendMessage(message.chat.id, `Wygrane: ${score.wins}. Przegrane: ${score.losses}. Remisy: ${score.draws}\nTy: Nożyczki\nJa: Nożyczki\nNo nic`)
            } else if (botChoice === "Papierz") {
              score.wins++
              await sendMessage(message.chat.id, `Wygrane: ${score.wins}. Przegrane: ${score.losses}. Remisy: ${score.draws}\nTy: Nożyczki\nJa: Papierz\nJesteś pojebany (mocno)`)
            } else {
              score.losses++
              await sendMessage(message.chat.id, `Wygrane: ${score.wins}. Przegrane: ${score.losses}. Remisy: ${score.draws}\nTy: Nożyczki\nJa: Kamień\nKurwa... spierdalaj`)
            }
          } else {
            if (botChoice === "Papierz") {
              score.draws++
              await sendMessage(message.chat.id, `Wygrane: ${score.wins}. Przegrane: ${score.losses}. Remisy: ${score.draws}\nTy: Papierz\nJa: Papierz\nNo nic`)
            } else if (botChoice === "Kamień") {
              score.wins++
              await sendMessage(message.chat.id, `Wygrane: ${score.wins}. Przegrane: ${score.losses}. Remisy: ${score.draws}\nTy: Papierz\nJa: Kamień\nJesteś pojebany (mocno)`)
            } else {
              score.losses++
              await sendMessage(message.chat.id, `Wygrane: ${score.wins}. Przegrane: ${score.losses}. Remisy: ${score.draws}\nTy: Papierz\nJa: Nożyczki\nKurwa... spierdalaj`)
            }
          }
        }
      }
    } catch (e) {
      console.error("Error:", e)
    }
    await new Promise(res => setTimeout(res, 1000))
  }
}

polling()