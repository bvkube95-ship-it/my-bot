import mysql from "mysql2/promise"
import { config } from "./config.js"

const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
})

await pool.execute(`
  CREATE TABLE IF NOT EXISTS users (
    chat_id        BIGINT PRIMARY KEY,
    username       VARCHAR(255),
    first_name     VARCHAR(255),
    message_count  INT DEFAULT 0,
    last_seen      DATETIME
    )
  `)

export async function trackMessage(chatId: number, username: string, firstName: string): Promise<void> {
  await pool.execute(`
    INSERT INTO users(chat_id, username, first_name, message_count, last_seen)
    VALUES(?, ?, ?, 1, NOW())
    ON DUPLICATE KEY UPDATE
      message_count = message_count + 1,
      last_seen  = NOW(), 
      username = VALUES(username)
      `, [chatId, username, firstName])
  }