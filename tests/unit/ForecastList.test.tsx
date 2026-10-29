import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../src/components/ForecastList';
import { mockWeatherData } from '../../src/mocks/weather';

describe('ForecastList', () => {
  it('renders five daily cards with date, condition, temperatures, and rain probability', () => {
    render(<ForecastList days={mockWeatherData.days} unit="celsius" />);

    expect(screen.getByRole('region', { name: 'Previsão de cinco dias' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getByText(/29 de out/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Nublado' })).toBeInTheDocument();
    expect(screen.getByText('26 °C')).toBeInTheDocument();
    expect(screen.getByText('18 °C')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('formats temperatures in Fahrenheit and handles unavailable rain probability', () => {
    const firstDay = mockWeatherData.days[0];

    render(
      <ForecastList
        days={[{ ...firstDay, precipitationProbabilityPct: null }]}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByText('79 °F')).toBeInTheDocument();
    expect(screen.getByText('65 °F')).toBeInTheDocument();
    expect(screen.getByText('Indisponível')).toBeInTheDocument();
  });

  it('shows an empty state when no forecast days are available', () => {
    render(<ForecastList days={[]} unit="celsius" />);

    expect(screen.getByRole('status')).toHaveTextContent('Previsão indisponível.');
  });
});
