import "dotenv/config";
import express from "express";
import { webhook } from "./controllers/webhook.js";

const app = express();

app.use(express.json());

app.post("/webhook", webhook);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});