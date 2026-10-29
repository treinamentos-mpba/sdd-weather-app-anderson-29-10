import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  days: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ days, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-heading">
      <h2 id="forecast-heading" className="mb-4 text-lg font-semibold text-white">
        Previsão de cinco dias
      </h2>
      {days.length === 0 ? (
        <p
          role="status"
          className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70"
        >
          Previsão indisponível.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {days.map((day) => (
            <ForecastCard key={day.date} day={day} unit={unit} />
          ))}
        </div>
      )}
    </section>
  );
}
