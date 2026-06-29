import "dotenv/config";
import { config } from "./config.js";
const API = `https://api.telegram.org/bot${config.token}`;
async function getUpdates(offset) {
    const response = await fetch(`${API}/getUpdates?offset=${offset}`);
    const data = await response.json();
    return data.result;
}
async function sendMessage(chatId, text) {
    await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text })
    });
}
const scores = {};
async function polling() {
    let offset = 0;
    while (true) {
        try {
            const updates = await getUpdates(offset);
            for (const update of updates) {
                offset = update.update_id + 1;
                const message = update.message;
                if (!message || !message.text)
                    continue;
                if (message.text === "/start") {
                    await fetch(`${API}/sendMessage`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            chat_id: message.chat.id,
                            text: "Hey there! What do you want to do?",
                            reply_markup: {
                                keyboard: [["Play", "Вариант 2"]],
                                resize_keyboard: true
                            }
                        })
                    });
                }
                if (message.text === "Play") {
                    await fetch(`${API}/sendMessage`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            chat_id: message.chat.id,
                            text: "Choose your option:",
                            reply_markup: {
                                keyboard: [["Rock", "Scissors", "Paper"]],
                                resize_keyboard: true
                            }
                        })
                    });
                }
                const choices = ["Rock", "Scissors", "Paper"];
                if (choices.includes(message.text)) {
                    const chatId = message.chat.id;
                    if (!scores[chatId]) {
                        scores[chatId] = { wins: 0, losses: 0, draws: 0 };
                    }
                    const userChoice = message.text;
                    const botChoice = choices[Math.floor(Math.random() * 3)];
                    const score = scores[chatId];
                    if (userChoice === "Rock") {
                        if (botChoice === "Rock") {
                            score.draws++;
                            await sendMessage(message.chat.id, `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Rock\nMe: Rock\n\nIt's a draw!`);
                        }
                        else if (botChoice === "Scissors") {
                            score.wins++;
                            await sendMessage(message.chat.id, `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Rock\nMe: Scissors\n\nYou won!`);
                        }
                        else {
                            score.losses++;
                            await sendMessage(message.chat.id, `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Rock\nMe: Paper\n\nYou lost!`);
                        }
                    }
                    else if (userChoice === "Scissors") {
                        if (botChoice === "Scissors") {
                            score.draws++;
                            await sendMessage(message.chat.id, `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Scissors\nMe: Scissors\n\nIt's a draw!`);
                        }
                        else if (botChoice === "Paper") {
                            score.wins++;
                            await sendMessage(message.chat.id, `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Scissors\nMe: Paper\n\nYou won!`);
                        }
                        else {
                            score.losses++;
                            await sendMessage(message.chat.id, `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Scissors\nMe: Rock\n\nYou lost!`);
                        }
                    }
                    else {
                        if (botChoice === "Paper") {
                            score.draws++;
                            await sendMessage(message.chat.id, `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Paper\nMe: Paper\n\nIt's a draw!`);
                        }
                        else if (botChoice === "Rock") {
                            score.wins++;
                            await sendMessage(message.chat.id, `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Paper\nMe: Rock\n\nYou won!`);
                        }
                        else {
                            score.losses++;
                            await sendMessage(message.chat.id, `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Paper\nMe: Scissors\n\nYou lost!`);
                        }
                    }
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