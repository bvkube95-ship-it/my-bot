import "dotenv/config";
import { config } from "./config.js";
class TelegramBot {
    api;
    constructor(token) {
        this.api = `https://api.telegram.org/bot${token}`;
    }
    async getUpdates(offset) {
        const response = await fetch(`${this.api}/getUpdates?offset=${offset}`);
        const data = await response.json();
        return data.result;
    }
    async sendMessage(chatId, text) {
        await fetch(`${this.api}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text })
        });
    }
    async sendKeyboard(chatId, text, keyboard) {
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
        });
    }
}
const bot = new TelegramBot(config.token);
class RockPaperScissors {
    choices = ["Rock", "Scissors", "Paper"];
    scores = {};
    getResult(chatId, userChoice) {
        if (!this.scores[chatId]) {
            this.scores[chatId] = { wins: 0, losses: 0, draws: 0 };
        }
        const botChoice = this.choices[Math.floor(Math.random() * 3)];
        const score = this.scores[chatId];
        if (!score)
            return "Unknown choice";
        if (userChoice === "Rock") {
            if (botChoice === "Rock") {
                score.draws++;
                return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Rock\nMe: Rock\n\nIt's a draw!`;
            }
            else if (botChoice === "Scissors") {
                score.wins++;
                return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Rock\nMe: Scissors\n\nYou won!`;
            }
            else {
                score.losses++;
                return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Rock\nMe: Paper\n\nYou lost!`;
            }
        }
        else if (userChoice === "Scissors") {
            if (botChoice === "Scissors") {
                score.draws++;
                return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Scissors\nMe: Scissors\n\nIt's a draw!`;
            }
            else if (botChoice === "Paper") {
                score.wins++;
                return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Scissors\nMe: Paper\n\nYou won!`;
            }
            else {
                score.losses++;
                return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Scissors\nMe: Rock\n\nYou lost!`;
            }
        }
        else {
            if (botChoice === "Paper") {
                score.draws++;
                return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Paper\nMe: Paper\n\nIt's a draw!`;
            }
            else if (botChoice === "Rock") {
                score.wins++;
                return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Paper\nMe: Rock\n\nYou won!`;
            }
            else {
                score.losses++;
                return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Paper\nMe: Scissors\n\nYou lost!`;
            }
        }
    }
    isChoice(text) {
        return this.choices.includes(text);
    }
}
const game = new RockPaperScissors();
async function polling() {
    let offset = 0;
    while (true) {
        try {
            const updates = await bot.getUpdates(offset);
            for (const update of updates) {
                offset = update.update_id + 1;
                const message = update.message;
                if (!message || !message.text)
                    continue;
                if (message.text === "/start") {
                    await bot.sendKeyboard(message.chat.id, "Hey there! What do you want to do?", [["Play", "Option 2"]]);
                }
                else if (message.text === "Play") {
                    await bot.sendKeyboard(message.chat.id, "Choose your option:", [["Rock", "Scissors", "Paper"]]);
                }
                else if (game.isChoice(message.text)) {
                    const result = game.getResult(message.chat.id, message.text);
                    await bot.sendMessage(message.chat.id, result);
                }
                else {
                    await bot.sendMessage(message.chat.id, "I don't understand that command.");
                }
            }
        }
        catch (e) {
            console.error("Error:", e);
        }
        await new Promise(res => setTimeout(res, 1000));
    }
}
polling();
//# sourceMappingURL=bot.js.map