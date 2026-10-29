import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockWeatherData } from '../../src/mocks/weather';
import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';

describe('searchCities', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns an empty list without calling fetch for blank input', async () => {
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   ')).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('encodes the name and maps geocoding results to City', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [
            {
              id: 3448439,
              name: 'São Paulo',
              latitude: -23.55,
              longitude: -46.63,
              admin1: 'São Paulo',
              country: 'Brasil',
              timezone: 'America/Sao_Paulo',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities(' São Paulo ')).resolves.toEqual([
      {
        id: 3448439,
        name: 'São Paulo',
        latitude: -23.55,
        longitude: -46.63,
        admin1: 'São Paulo',
        country: 'Brasil',
        timezone: 'America/Sao_Paulo',
      },
    ]);
    expect(String(fetchMock.mock.calls[0][0])).toContain('name=S%C3%A3o%20Paulo');
  });

  it('returns an empty list when the API has no results', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ generationtime_ms: 0.1 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('Cidade inexistente')).resolves.toEqual([]);
  });

  it('throws WeatherServiceError when the API response is not ok', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);

    const request = searchCities('São Paulo');

    await expect(request).rejects.toBeInstanceOf(WeatherServiceError);
    await expect(request).rejects.toMatchObject({
      code: 'http',
      operation: 'geocoding',
    });
  });
});

describe('getWeather', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests current and daily forecast and maps five parallel daily entries', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          timezone: 'America/Sao_Paulo',
          current: {
            time: '2026-10-29T12:00',
            temperature_2m: 22.4,
            weather_code: 3,
            relative_humidity_2m: 64,
            wind_speed_10m: 14.4,
            precipitation: 0.2,
            surface_pressure: 1012.3,
          },
          daily: {
            time: ['2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02'],
            weather_code: [3, 2, 61, 0, 1],
            temperature_2m_min: [18.1, 17.4, 19, 16.8, 17.2],
            temperature_2m_max: [26.2, 25, 27.1, 24.5, 25.3],
            precipitation_probability_max: [30, 20, 60, 10, 15],
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const weather = await getWeather(mockWeatherData.city);

    expect(weather.city).toEqual(mockWeatherData.city);
    expect(weather.timezone).toBe('America/Sao_Paulo');
    expect(weather.current).toEqual({
      temperatureC: 22.4,
      weatherCode: 3,
      observedAt: '2026-10-29T12:00',
      relativeHumidityPct: 64,
      windSpeedKmh: 14.4,
      precipitationMm: 0.2,
      pressureHpa: 1012.3,
    });
    expect(weather.days).toHaveLength(5);
    expect(weather.days[2]).toEqual({
      date: '2026-10-31',
      weatherCode: 61,
      minTemperatureC: 19,
      maxTemperatureC: 27.1,
      precipitationProbabilityPct: 60,
    });

    const requestUrl = new URL(String(fetchMock.mock.calls[0][0]));
    expect(requestUrl.searchParams.get('latitude')).toBe('-23.55');
    expect(requestUrl.searchParams.get('longitude')).toBe('-46.63');
    expect(requestUrl.searchParams.get('current')).toContain('temperature_2m');
    expect(requestUrl.searchParams.get('daily')).toContain('precipitation_probability_max');
    expect(requestUrl.searchParams.get('forecast_days')).toBe('5');
    expect(requestUrl.searchParams.get('timezone')).toBe('auto');
    expect(requestUrl.searchParams.get('temperature_unit')).toBe('celsius');
  });

  it.each([
    'current',
    'daily',
  ] as const)('throws WeatherServiceError when %s is missing', async (field) => {
    const payload = {
      timezone: 'America/Sao_Paulo',
      current: {
        time: '2026-10-29T12:00',
        temperature_2m: 22.4,
        weather_code: 3,
      },
      daily: {
        time: ['2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02'],
      },
    };
    if (field === 'current') Reflect.deleteProperty(payload, 'current');
    if (field === 'daily') Reflect.deleteProperty(payload, 'daily');

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(getWeather(mockWeatherData.city)).rejects.toMatchObject({
      name: 'WeatherServiceError',
      code: 'invalid-response',
      operation: 'forecast',
    });
  });
});
