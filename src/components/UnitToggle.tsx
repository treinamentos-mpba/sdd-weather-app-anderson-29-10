import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

const buttonBaseClassName =
  'min-w-11 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900';

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 p-1 backdrop-blur-md"
    >
      <button
        type="button"
        aria-label="Celsius"
        aria-pressed={unit === 'celsius'}
        onClick={() => onChange('celsius')}
        className={`${buttonBaseClassName} ${
          unit === 'celsius'
            ? 'bg-accent-400 text-night-900 shadow-sm'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        °C
      </button>
      <button
        type="button"
        aria-label="Fahrenheit"
        aria-pressed={unit === 'fahrenheit'}
        onClick={() => onChange('fahrenheit')}
        className={`${buttonBaseClassName} ${
          unit === 'fahrenheit'
            ? 'bg-accent-400 text-night-900 shadow-sm'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        °F
      </button>
    </div>
  );
}
