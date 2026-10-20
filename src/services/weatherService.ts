export interface WeatherData {
  city: string
  temperature: number
  humidity: number
  apparentTemperature: number
  weatherCode: number
  windSpeed: number
  conditionText: string
  isRain: boolean
  isExtremeHeat: boolean
  isExcessiveCold: boolean
  fetchedAt: string
}

// Map WMO weather codes to human-readable Portuguese conditions
function interpretWmoCode(code: number): { text: string; isRain: boolean } {
  if (code === 0) return { text: 'Céu limpo e ensolarado', isRain: false }
  if (code === 1 || code === 2) return { text: 'Parcialmente nublado', isRain: false }
  if (code === 3) return { text: 'Encoberto / Nublado', isRain: false }
  if (code >= 45 && code <= 48) return { text: 'Nevoeiro / Neblina', isRain: false }
  if (code >= 51 && code <= 55) return { text: 'Garoa leve', isRain: true }
  if (code >= 61 && code <= 65) return { text: 'Chuva', isRain: true }
  if (code >= 80 && code <= 82) return { text: 'Pancadas de chuva', isRain: true }
  if (code >= 95) return { text: 'Tempestade com trovoadas', isRain: true }
  return { text: 'Condições estáveis', isRain: false }
}

export async function fetchCurrentWeather(
  latitude: number = -23.55052,
  longitude: number = -46.633308,
  cityName: string = 'São Paulo'
): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`

    const res = await fetch(url, { next: { revalidate: 900 } })
    if (!res.ok) {
      throw new Error(`Weather API error: ${res.statusText}`)
    }

    const data = await res.json()
    const current = data.current
    const condition = interpretWmoCode(current.weather_code)

    return {
      city: cityName,
      temperature: Math.round(current.temperature_2m * 10) / 10,
      humidity: Math.round(current.relative_humidity_2m),
      apparentTemperature: Math.round(current.apparent_temperature * 10) / 10,
      weatherCode: current.weather_code,
      windSpeed: Math.round(current.wind_speed_10m),
      conditionText: condition.text,
      isRain: condition.isRain,
      isExtremeHeat: current.temperature_2m >= 28,
      isExcessiveCold: current.temperature_2m <= 15,
      fetchedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.warn('Using standard fallback weather due to network limit:', err)
    return {
      city: cityName,
      temperature: 24,
      humidity: 65,
      apparentTemperature: 24.5,
      weatherCode: 1,
      windSpeed: 12,
      conditionText: 'Tempo ameno (Dados offline)',
      isRain: false,
      isExtremeHeat: false,
      isExcessiveCold: false,
      fetchedAt: new Date().toISOString(),
    }
  }
}
