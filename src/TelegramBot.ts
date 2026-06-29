import type { Update } from "./types.js"

export class TelegramBot {
  private api: string

  constructor(token: string) {
    this.api = `https://api.telegram.org/bot${token}`
  }

  async getUpdates(offset: number): Promise<Update[]> {
    const response = await fetch(`${this.api}/getUpdates?offset=${offset}`)
    const data = await response.json()
    return data.result
  }
  
  async sendMessage(chatId: number, text: string): Promise<void> {
    await fetch(`${this.api}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    })
  }

  async sendKeyboard(chatId: number, text: string, keyboard: string[][]): Promise<void> {
    await fetch(`${this.api}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: {
          keyboard,
          resize_keyboard: true
        }
      })
    })
  }
}
export default TelegramBot