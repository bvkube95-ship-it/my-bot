import "dotenv/config";
import process from "node:process";
function requireEnv(name) {
    const value = process.env[name];
    if (!value)
        throw new Error(`${name} ia not defiend in .env`);
    return value;
}
export const config = {
    token: requireEnv("TELEGRAM_TOKEN")
};
//# sourceMappingURL=config.js.map