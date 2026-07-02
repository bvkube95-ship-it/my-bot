export default class RockPaperScissors {
  private choices = ["rock", "scissors", "paper", "reset"]
  private scores: Record<number, { wins: number, losses: number, draws: number }> = {}

  getResult(chatId: number, userChoice: string): string {
    if (!this.scores[chatId]) {
      this.scores[chatId] = { wins: 0, losses: 0, draws: 0 }
    }

    const botChoice = this.choices[Math.floor(Math.random() * 3)]
    const score = this.scores[chatId]

        if (userChoice === "reset") {
          score.draws = 0
          score.wins = 0
          score.losses = 0
          const scoreLine = `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}`
          return `Score was reset\n${scoreLine}`
        }

    let outcome = ""

    if (userChoice === "rock") {
      if (botChoice === "rock") { score.draws++; outcome = "It's a draw!" }
      else if (botChoice === "scissors") { score.wins++; outcome = "You won!" }
      else { score.losses++; outcome = "You lost!" }
    } else if (userChoice === "scissors") {
      if (botChoice === "scissors") { score.draws++; outcome = "It's a draw!" }
      else if (botChoice === "paper") { score.wins++; outcome = "You won!" }
      else { score.losses++; outcome = "You lost!" }
    } else {
      if (botChoice === "paper") { score.draws++; outcome = "It's a draw!" }
      else if (botChoice === "rock") { score.wins++; outcome = "You won!" }
      else { score.losses++; outcome = "You lost!" }
    }

    const scoreLine = `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}`
    return `${scoreLine}\n\nYou: ${userChoice}\nMe: ${botChoice}\n\n${outcome}`
    }

  isChoice(text: string): boolean {
    return this.choices.includes(text)
  }
}