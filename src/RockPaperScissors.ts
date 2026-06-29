export default class RockPaperScissors {
  private choices = ["Rock", "Scissors", "Paper"]
  private scores: Record<number, { wins: number, losses: number, draws: number }> = {}

  getResult(chatId: number, userChoice: string): string {
    if (!this.scores[chatId]) {
      this.scores[chatId] = { wins: 0, losses: 0, draws: 0 }
    }

    const botChoice = this.choices[Math.floor(Math.random() * 3)]
    const score = this.scores[chatId]
    if(!score) return "Unknown choice"

        if (userChoice === "Rock") {
          if (botChoice === "Rock") {
            score.draws++
            return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Rock\nMe: Rock\n\nIt's a draw!`
          } else if (botChoice === "Scissors") {
            score.wins++
            return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Rock\nMe: Scissors\n\nYou won!`
          } else {
            score.losses++
            return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Rock\nMe: Paper\n\nYou lost!`
          }
        } else if (userChoice === "Scissors") {
          if (botChoice === "Scissors") {
            score.draws++
            return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Scissors\nMe: Scissors\n\nIt's a draw!`
          } else if (botChoice === "Paper") {
            score.wins++
            return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Scissors\nMe: Paper\n\nYou won!`
          } else {
            score.losses++
            return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Scissors\nMe: Rock\n\nYou lost!`
          }
        } else {
          if (botChoice === "Paper") {
            score.draws++
            return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Paper\nMe: Paper\n\nIt's a draw!`
          } else if (botChoice === "Rock") {
            score.wins++
            return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Paper\nMe: Rock\n\nYou won!`
          } else {
            score.losses++
            return `Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}\n\nYou: Paper\nMe: Scissors\n\nYou lost!`
          }
      }
    }

  isChoice(text: string): boolean {
    return this.choices.includes(text)
  }
}