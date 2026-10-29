import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    latitude: -23.55,
    longitude: -46.63,
    admin1: 'São Paulo',
    country: 'Brasil',
    timezone: 'America/Sao_Paulo',
  },
  timezone: 'America/Sao_Paulo',
  current: {
    temperatureC: 22.4,
    weatherCode: 3,
    observedAt: '2026-10-29T12:00',
    relativeHumidityPct: 64,
    windSpeedKmh: 14.4,
    precipitationMm: 0.2,
    pressureHpa: 1012.3,
  },
  days: [
    {
      date: '2026-10-29',
      weatherCode: 3,
      minTemperatureC: 18.1,
      maxTemperatureC: 26.2,
    },
    {
      date: '2026-10-30',
      weatherCode: 2,
      minTemperatureC: 17.4,
      maxTemperatureC: 25.0,
    },
    {
      date: '2026-10-31',
      weatherCode: 61,
      minTemperatureC: 19.0,
      maxTemperatureC: 27.1,
    },
    {
      date: '2026-11-01',
      weatherCode: 0,
      minTemperatureC: 16.8,
      maxTemperatureC: 24.5,
    },
    {
      date: '2026-11-02',
      weatherCode: 1,
      minTemperatureC: 17.2,
      maxTemperatureC: 25.3,
    },
  ],
};
