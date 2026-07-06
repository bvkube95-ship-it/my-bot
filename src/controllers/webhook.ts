import type { Request, Response } from "express"
import { handleMessage } from "../messageHandler.js"
import { trackMessage } from "../database/database.js"

export async function webhook(req: Request, res: Response) {
  try {
    const update = req.body

    if (!update.message?.text) {
      return res.sendStatus(200)
    }

    const message = update.message

    const chatId = message.chat.id
    const text = message.text.toLowerCase()
    const username = message.from?.username ?? "unknown"
    const firstName = message.from?.first_name ?? ""

    await trackMessage(chatId, username, firstName)

    await handleMessage(chatId, text)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}