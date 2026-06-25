import "dotenv/config"
import type { Update, Message } from "./types.js"
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

async function poll() {
  let offset = 0

  while (true) {
    try {
      const updates = await getUpdates(offset)

      for (const update of updates) {
        console.log(update)
        offset = update.update_id + 1
      }
    } catch (e) {
      console.error("Error:", e)
    }
    await new Promise(res => setTimeout(res, 1000))
  }
}
poll()

