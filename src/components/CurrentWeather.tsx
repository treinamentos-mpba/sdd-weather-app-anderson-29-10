import { formatTemperature } from '../lib/temperature';
import { getWeatherCodePresentation } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatMetric(value: number | null, suffix: string): string {
  if (value === null || !Number.isFinite(value)) return 'Indisponível';

  const formattedValue = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(value);

  return suffix === '%' ? `${formattedValue}${suffix}` : `${formattedValue} ${suffix}`;
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const weather = getWeatherCodePresentation(current.weatherCode);
  const locationDetails = [city.admin1, city.country].filter(Boolean).join(', ');
  const metrics = [
    { label: 'Umidade', value: formatMetric(current.relativeHumidityPct, '%') },
    { label: 'Vento', value: formatMetric(current.windSpeedKmh, 'km/h') },
    { label: 'Precipitação', value: formatMetric(current.precipitationMm, 'mm') },
    { label: 'Pressão', value: formatMetric(current.pressureHpa, 'hPa') },
  ];

  return (
    <section
      aria-labelledby="current-weather-heading"
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-md sm:p-7"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white/60">Clima atual</p>
          <h2 id="current-weather-heading" className="mt-1 text-2xl font-semibold text-white">
            {city.name}
          </h2>
          {locationDetails && <p className="mt-1 text-sm text-white/65">{locationDetails}</p>}
        </div>

        <div className="flex items-center gap-4">
          <span role="img" aria-label={weather.label} className="text-5xl sm:text-6xl">
            {weather.icon}
          </span>
          <div>
            <p className="text-5xl font-semibold leading-none text-white sm:text-6xl">
              {formatTemperature(current.temperatureC, unit)}
            </p>
            <p className="mt-2 text-base text-white/75">{weather.label}</p>
          </div>
        </div>
      </div>

      <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-white/10 bg-night-800/70 p-3">
            <dt className="text-xs font-medium text-white/60">{metric.label}</dt>
            <dd className="mt-1 text-base font-semibold text-white">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
