import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

export type WeatherServiceErrorCode = 'timeout' | 'network' | 'http' | 'invalid-response';
export type WeatherServiceOperation = 'geocoding' | 'forecast';

export class WeatherServiceError extends Error {
  constructor(
    message: string,
    readonly code: WeatherServiceErrorCode,
    readonly operation: WeatherServiceOperation,
  ) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

const geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function optionalNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function mapCity(result: unknown): City {
  if (
    !isRecord(result) ||
    typeof result.id !== 'number' ||
    typeof result.name !== 'string' ||
    typeof result.latitude !== 'number' ||
    typeof result.longitude !== 'number'
  ) {
    throw new WeatherServiceError(
      'A resposta de geocoding contém uma cidade inválida.',
      'invalid-response',
      'geocoding',
    );
  }

  return {
    id: result.id,
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    admin1: optionalString(result.admin1),
    country: optionalString(result.country),
    timezone: optionalString(result.timezone),
  };
}

export async function searchCities(name: string): Promise<City[]> {
  const normalizedName = name.trim();
  if (normalizedName.length === 0) return [];

  const url = `${geocodingUrl}?name=${encodeURIComponent(normalizedName)}&count=10&language=pt&format=json`;
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new WeatherServiceError(
      'Não foi possível conectar ao serviço de busca de cidades.',
      'network',
      'geocoding',
    );
  }

  if (!response.ok) {
    throw new WeatherServiceError(
      `O serviço de busca de cidades respondeu com HTTP ${response.status}.`,
      'http',
      'geocoding',
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new WeatherServiceError(
      'O serviço de busca de cidades retornou JSON inválido.',
      'invalid-response',
      'geocoding',
    );
  }

  if (!isRecord(payload)) {
    throw new WeatherServiceError(
      'O serviço de busca de cidades retornou uma resposta inválida.',
      'invalid-response',
      'geocoding',
    );
  }

  if (payload.results === undefined && typeof payload.generationtime_ms === 'number') return [];

  if (!Array.isArray(payload.results)) {
    throw new WeatherServiceError(
      'O serviço de busca de cidades retornou uma resposta inválida.',
      'invalid-response',
      'geocoding',
    );
  }

  return payload.results.slice(0, 10).map(mapCity);
}

export async function getWeather(city: City): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(city.latitude));
  url.searchParams.set('longitude', String(city.longitude));
  url.searchParams.set(
    'current',
    'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure',
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max',
  );
  url.searchParams.set('forecast_days', '5');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('temperature_unit', 'celsius');

  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'TimeoutError';
    throw new WeatherServiceError(
      isTimeout
        ? 'A consulta meteorológica excedeu o tempo limite.'
        : 'Não foi possível conectar ao serviço meteorológico.',
      isTimeout ? 'timeout' : 'network',
      'forecast',
    );
  }

  if (!response.ok) {
    throw new WeatherServiceError(
      `O serviço meteorológico respondeu com HTTP ${response.status}.`,
      'http',
      'forecast',
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new WeatherServiceError(
      'O serviço meteorológico retornou JSON inválido.',
      'invalid-response',
      'forecast',
    );
  }

  if (!isRecord(payload) || !isRecord(payload.current) || !isRecord(payload.daily)) {
    throw new WeatherServiceError(
      'A resposta meteorológica não contém current ou daily.',
      'invalid-response',
      'forecast',
    );
  }

  const timezone = optionalString(payload.timezone);
  const dates = payload.daily.time;
  if (
    timezone === null ||
    !Array.isArray(dates) ||
    dates.length !== 5 ||
    dates.some((date) => typeof date !== 'string')
  ) {
    throw new WeatherServiceError(
      'A resposta meteorológica não contém timezone ou cinco datas válidas.',
      'invalid-response',
      'forecast',
    );
  }

  const current: CurrentWeather = {
    temperatureC: optionalNumber(payload.current.temperature_2m),
    weatherCode: optionalNumber(payload.current.weather_code),
    observedAt: optionalString(payload.current.time),
    relativeHumidityPct: optionalNumber(payload.current.relative_humidity_2m),
    windSpeedKmh: optionalNumber(payload.current.wind_speed_10m),
    precipitationMm: optionalNumber(payload.current.precipitation),
    pressureHpa: optionalNumber(payload.current.surface_pressure),
  };

  const weatherCodes = Array.isArray(payload.daily.weather_code) ? payload.daily.weather_code : [];
  const minTemperatures = Array.isArray(payload.daily.temperature_2m_min)
    ? payload.daily.temperature_2m_min
    : [];
  const maxTemperatures = Array.isArray(payload.daily.temperature_2m_max)
    ? payload.daily.temperature_2m_max
    : [];
  const precipitationProbabilities = Array.isArray(payload.daily.precipitation_probability_max)
    ? payload.daily.precipitation_probability_max
    : [];

  const days: ForecastDay[] = dates.map((date, index) => ({
    date,
    weatherCode: optionalNumber(weatherCodes[index]),
    minTemperatureC: optionalNumber(minTemperatures[index]),
    maxTemperatureC: optionalNumber(maxTemperatures[index]),
    precipitationProbabilityPct: optionalNumber(precipitationProbabilities[index]),
  }));

  return { city, timezone, current, days };
}
