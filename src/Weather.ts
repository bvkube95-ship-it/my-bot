export default class Weather {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getWeather(city: string): Promise<string> {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`
    )
    const data = await response.json()

    if (data.cod !== 200) {
      return "City not found."
    }

    return `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`
  }
}