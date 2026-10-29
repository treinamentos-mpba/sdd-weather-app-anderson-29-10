import { useId } from 'react';
import { formatForecastDay } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCodePresentation } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

function formatProbability(probability: number | null): string {
  if (probability === null || !Number.isFinite(probability)) return 'Indisponível';

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(probability)}%`;
}

export default function ForecastCard({ day, unit }: ForecastCardProps) {
  const headingId = useId();
  const dayLabel = formatForecastDay(day.date);
  const weather = getWeatherCodePresentation(day.weatherCode);

  return (
    <article
      aria-labelledby={headingId}
      className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-2.5 backdrop-blur-md sm:p-4"
    >
      <h3 id={headingId} className="break-words text-sm font-semibold capitalize text-white">
        {dayLabel}
      </h3>
      <div className="mt-3 flex min-w-0 items-center gap-2">
        <span aria-hidden="true" className="shrink-0 text-3xl">
          {weather.icon}
        </span>
        <p className="min-w-0 break-words text-xs text-white/80">{weather.label}</p>
      </div>
      <dl className="mt-4 space-y-2">
        <div className="flex min-w-0 flex-wrap justify-between gap-x-2 gap-y-1 text-sm">
          <dt className="text-white/75">Máx.</dt>
          <dd className="min-w-0 break-words text-right font-semibold text-white">
            {formatTemperature(day.maxTemperatureC, unit)}
          </dd>
        </div>
        <div className="flex min-w-0 flex-wrap justify-between gap-x-2 gap-y-1 text-sm">
          <dt className="text-white/75">Mín.</dt>
          <dd className="min-w-0 break-words text-right font-medium text-white">
            {formatTemperature(day.minTemperatureC, unit)}
          </dd>
        </div>
        <div className="flex min-w-0 flex-col gap-1 text-xs sm:text-sm">
          <dt className="break-words text-white/75">Probabilidade de chuva</dt>
          <dd className="break-words text-right font-medium text-white">
            {formatProbability(day.precipitationProbabilityPct)}
          </dd>
        </div>
      </dl>
    </article>
  );
}
