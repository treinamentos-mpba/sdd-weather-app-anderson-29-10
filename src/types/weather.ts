/** Unidade usada para apresentar as temperaturas. */
export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number; // Identificador da localidade retornado pelo Geocoding API.
  name: string; // Nome da cidade retornado pelo provedor.
  latitude: number; // Latitude usada para consultar a previsão.
  longitude: number; // Longitude usada para consultar a previsão.
  admin1: string | null; // Região administrativa, quando disponível.
  country: string | null; // País, quando disponível.
  timezone: string | null; // Fuso IANA do geocoding, quando retornado.
}

export interface CurrentWeather {
  temperatureC: number | null; // Temperatura atual normalizada para Celsius.
  weatherCode: number | null; // Código WMO da condição atual.
  observedAt: string | null; // Horário de referência no fuso de WeatherData.timezone.
  relativeHumidityPct: number | null; // current.relative_humidity_2m, em porcentagem.
  windSpeedKmh: number | null; // current.wind_speed_10m, em km/h.
  precipitationMm: number | null; // current.precipitation, em milímetros.
  pressureHpa: number | null; // current.surface_pressure, em hPa.
}

export interface ForecastDay {
  date: string; // Data local no formato YYYY-MM-DD.
  weatherCode: number | null; // Código WMO da condição diária.
  minTemperatureC: number | null; // Temperatura mínima normalizada para Celsius.
  maxTemperatureC: number | null; // Temperatura máxima normalizada para Celsius.
}

export interface WeatherData {
  city: City; // Localidade selecionada pela pessoa usuária.
  timezone: string; // Fuso IANA usado para datas e horários locais.
  current: CurrentWeather; // Condições meteorológicas atuais.
  days: ForecastDay[]; // Cinco datas locais; campos ausentes permanecem null.
}
