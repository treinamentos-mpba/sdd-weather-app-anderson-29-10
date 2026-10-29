import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../src/components/CurrentWeather';
import { mockWeatherData } from '../../src/mocks/weather';

describe('CurrentWeather', () => {
  it('renders the city, weather presentation, and current metrics', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={mockWeatherData.current}
        unit="celsius"
      />,
    );

    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getByText('Nublado')).toBeInTheDocument();
    expect(screen.getByText('22 °C')).toBeInTheDocument();
    expect(screen.getByText('64%')).toBeInTheDocument();
    expect(screen.getByText('14,4 km/h')).toBeInTheDocument();
    expect(screen.getByText('0,2 mm')).toBeInTheDocument();
    expect(screen.getByText('1.012,3 hPa')).toBeInTheDocument();
  });

  it('formats the hero temperature in the selected unit', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={mockWeatherData.current}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByText('72 °F')).toBeInTheDocument();
  });

  it('labels missing metrics as unavailable', () => {
    render(
      <CurrentWeather
        city={mockWeatherData.city}
        current={{ ...mockWeatherData.current, pressureHpa: null }}
        unit="celsius"
      />,
    );

    expect(screen.getByText('Indisponível')).toBeInTheDocument();
  });
});
