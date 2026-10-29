import { useId } from 'react';
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
  const headingId = useId();
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
      aria-labelledby={headingId}
      className="rounded-lg border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md sm:p-7"
    >
      <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white/75">Clima atual</p>
          <h2 id={headingId} className="mt-1 break-words text-2xl font-semibold text-white">
            {city.name}
          </h2>
          {locationDetails && (
            <p className="mt-1 break-words text-sm text-white/75">{locationDetails}</p>
          )}
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
          <span aria-hidden="true" className="shrink-0 text-4xl sm:text-6xl">
            {weather.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="break-words text-4xl font-semibold leading-none text-white sm:text-6xl">
              {formatTemperature(current.temperatureC, unit)}
            </p>
            <p className="mt-2 break-words text-base text-white/80">{weather.label}</p>
          </div>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-2 sm:mt-7 sm:grid-cols-4 sm:gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="min-w-0 rounded-lg border border-white/10 bg-night-800/70 p-2.5 sm:p-3"
          >
            <dt className="break-words text-xs font-medium text-white/75">{metric.label}</dt>
            <dd className="mt-1 break-words text-sm font-semibold text-white sm:text-base">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
