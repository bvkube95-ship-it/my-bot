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
                    await sendMessage(message.chat.id, `No co z tym '/Start', człowieku?`);
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