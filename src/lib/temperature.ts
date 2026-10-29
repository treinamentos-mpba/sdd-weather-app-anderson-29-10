import type { Unit } from '../types/weather';

export function formatTemperature(temperatureC: number | null, unit: Unit): string {
  if (temperatureC === null || !Number.isFinite(temperatureC)) return 'Indisponível';

  const temperature = unit === 'fahrenheit' ? (temperatureC * 9) / 5 + 32 : temperatureC;
  const formattedTemperature = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0,
  }).format(temperature);
  const unitSymbol = unit === 'fahrenheit' ? '°F' : '°C';

  return `${formattedTemperature} ${unitSymbol}`;
}
