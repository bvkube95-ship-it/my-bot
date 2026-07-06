import { getUser } from "../database/database.js";

export async function getStatus(chatId: number): Promise<string> {
  const user = await getUser(chatId);

  if (!user) {
    return "User not found";
  }

  const date = new Date(user.first_seen);
  const formatted = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;

  return `Name: ${user.first_name}
  Username: @${user.username}
  Messages: ${user.message_count}
  With us since: ${formatted}`
}