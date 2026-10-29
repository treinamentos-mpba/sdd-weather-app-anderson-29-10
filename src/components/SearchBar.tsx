import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [city, setCity] = useState('');
  const [showEmptyError, setShowEmptyError] = useState(false);
  const hasEmptyError = showEmptyError && city.trim().length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (disabled) return;

    const trimmedCity = city.trim();

    if (trimmedCity.length === 0) {
      setShowEmptyError(true);
      return;
    }

    setShowEmptyError(false);
    onSearch(trimmedCity);
  }

  function handleChange(value: string) {
    setCity(value);
    if (value.trim().length > 0) setShowEmptyError(false);
  }

  return (
    <form
      role="search"
      aria-label="Buscar cidade"
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:flex-row sm:items-end"
    >
      <div className="min-w-0 flex-1">
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-white/85">
          Cidade
        </label>
        <input
          id={inputId}
          type="search"
          value={city}
          onChange={(event) => handleChange(event.currentTarget.value)}
          disabled={disabled}
          aria-invalid={hasEmptyError || undefined}
          aria-describedby={hasEmptyError ? errorId : undefined}
          placeholder="Ex.: São Paulo"
          className="h-11 w-full rounded-lg border border-white/20 bg-night-800/80 px-3 text-base text-white placeholder:text-white/65 focus-visible:border-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/70 disabled:cursor-not-allowed disabled:opacity-60"
        />
        {hasEmptyError && (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-300">
            Informe uma cidade.
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="h-11 rounded-lg bg-accent-400 px-5 font-semibold text-night-900 transition-colors hover:bg-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Buscar
      </button>
    </form>
  );
}
