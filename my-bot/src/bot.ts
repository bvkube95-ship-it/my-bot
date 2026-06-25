import "dotenv/config"
import type { Update, Message } from "./types.js"

const TOKEN = "8969236764:AAHmC2OqQlqQcHk9vhNhucVkWib1y3k28uI"
const API = `https://api.telegram.org/bot${TOKEN}`

async function getUpdates(): Promise<Update[]> {
  const response = await fetch(`${API}/getUpdates`)
  const data = await response.json()
  return data.result
}

async function sendMessages(chatId: number, text: string): Promise<void> {
  await fetch(`${API}/sendMessage?chat_id=${chatId}&text=${text}`)
}

async function poll() {
  while (true) {
    const updates = await getUpdates()

    for (const update of updates) {
      console.log(update)
    }

    await new Promise(res => setTimeout(res, 1000))
  }
}
poll()

