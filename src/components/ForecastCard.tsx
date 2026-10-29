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
  const dayLabel = formatForecastDay(day.date);
  const weather = getWeatherCodePresentation(day.weatherCode);

  return (
    <article
      aria-label={`Previsão para ${dayLabel}`}
      className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-md sm:p-4"
    >
      <h3 className="text-sm font-semibold capitalize text-white">{dayLabel}</h3>
      <div className="mt-3 flex items-center gap-2">
        <span role="img" aria-label={weather.label} className="text-3xl">
          {weather.icon}
        </span>
        <p className="min-w-0 text-xs text-white/70">{weather.label}</p>
      </div>
      <dl className="mt-4 space-y-2">
        <div className="flex justify-between gap-2 text-sm">
          <dt className="text-white/60">Máx.</dt>
          <dd className="font-semibold text-white">
            {formatTemperature(day.maxTemperatureC, unit)}
          </dd>
        </div>
        <div className="flex justify-between gap-2 text-sm">
          <dt className="text-white/60">Mín.</dt>
          <dd className="font-medium text-white/85">
            {formatTemperature(day.minTemperatureC, unit)}
          </dd>
        </div>
        <div className="flex justify-between gap-2 text-sm">
          <dt className="text-white/60">Probabilidade de chuva</dt>
          <dd className="font-medium text-white/85">
            {formatProbability(day.precipitationProbabilityPct)}
          </dd>
        </div>
      </dl>
    </article>
  );
}
