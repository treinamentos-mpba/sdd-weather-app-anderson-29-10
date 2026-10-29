import { useEffect, useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { mockWeatherData } from './mocks/weather';
import type { Unit, WeatherData } from './types/weather';

type WeatherContentState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: WeatherData };

const mockSearchDelayMs = 250;

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [content, setContent] = useState<WeatherContentState>({ status: 'idle' });
  const [lastSearch, setLastSearch] = useState<string | null>(null);
  const searchTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (searchTimer.current !== null) window.clearTimeout(searchTimer.current);
    },
    [],
  );

  function handleSearch(city: string) {
    if (searchTimer.current !== null) window.clearTimeout(searchTimer.current);

    setLastSearch(city);
    setContent({ status: 'loading' });
    searchTimer.current = window.setTimeout(() => {
      searchTimer.current = null;

      try {
        const matchesMockCity =
          city.localeCompare(mockWeatherData.city.name, 'pt-BR', { sensitivity: 'base' }) === 0;

        setContent(
          matchesMockCity ? { status: 'success', data: mockWeatherData } : { status: 'empty' },
        );
      } catch {
        setContent({
          status: 'error',
          message: 'Não foi possível carregar o clima. Tente novamente.',
        });
      }
    }, mockSearchDelayMs);
  }

  function handleRetry() {
    if (lastSearch) {
      handleSearch(lastSearch);
      return;
    }

    setContent({ status: 'idle' });
  }

  function renderContent() {
    switch (content.status) {
      case 'idle':
        return (
          <EmptyState
            title="Consulte o clima de uma cidade"
            tip="Busque São Paulo para carregar os dados de demonstração."
          />
        );
      case 'loading':
        return <LoadingState message="Buscando clima..." />;
      case 'empty':
        return (
          <EmptyState
            title="Nenhuma cidade encontrada"
            tip="Confira a escrita ou tente São Paulo, disponível no modo de demonstração."
          />
        );
      case 'error':
        return <ErrorState message={content.message} onRetry={handleRetry} />;
      case 'success':
        return (
          <div className="space-y-6">
            <CurrentWeather city={content.data.city} current={content.data.current} unit={unit} />
            <ForecastList days={content.data.days} unit={unit} />
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night-900 via-night-800 to-night-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span aria-hidden="true" className="text-3xl text-sun">
                ☀️
              </span>
              <div>
                <p className="text-xs font-semibold uppercase text-white/70">Clima local</p>
                <h1 className="text-2xl font-bold text-white sm:text-3xl">WeatherView</h1>
              </div>
            </div>
            <UnitToggle unit={unit} onChange={setUnit} />
          </div>
          <div className="mt-6">
            <SearchBar onSearch={handleSearch} disabled={content.status === 'loading'} />
          </div>
        </header>

        <main>{renderContent()}</main>
      </div>
    </div>
  );
}
