export default class TelegramClient {
  private api: string

  constructor(token: string) {
    this.api = `https://api.telegram.org/bot${token}`
  }

  async setWebhook(url: string): Promise<void> {
  const response = await fetch(`${this.api}/setWebhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url
    })
  });

  if (!response.ok) {
    throw new Error(`Telegram API error ${response.status}`);
    }
  }
  
  async sendMessage(chatId: number, text: string): Promise<void> {
    const response = await fetch(`${this.api}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    })
    if (!response.ok) {
      throw new Error(`Telegram API error ${response.status}`)
    }
  }

  async sendKeyboard(chatId: number, text: string, keyboard: string[][]): Promise<void> {
    const response = await fetch(`${this.api}/sendMessage`, {
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
    if (!response.ok) {
      throw new Error(`Telegram API error ${response.status}`)
    }
  }
}