import "dotenv/config"
import process from "node:process"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} ia not defiend in .env`)
  return value
}

export const config = {
  token: requireEnv("TELEGRAM_TOKEN"),
  weatherKey: requireEnv("OPENWEATHER_KEY"),
  dbHost: requireEnv("DB_HOST"),
  dbUser: requireEnv("DB_USER"),
  dbPassword: process.env.DB_PASSWORD ?? "",
  dbName: requireEnv("DB_NAME"),
}