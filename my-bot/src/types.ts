export interface User {
  id: number
  first_name: string
  username?: string
  is_bot: boolean
}

export interface Chat {
  id: number
  type: "private" | "group" | "supergroup" | "channel"
  first_name?: string
}

export interface Message {
  message_id: number
  from: User
  chat: Chat
  text?: string
  datge: number
}

export interface Update {
  update_id: number
  message?: Message
}