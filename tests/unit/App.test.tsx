import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../../src/App';

describe('App', () => {
  it('moves from idle through loading to the mock weather success state', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Consulte o clima de uma cidade' }),
    ).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(screen.getByRole('status')).toHaveTextContent('Buscando clima...');
    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
  });

  it('shows the empty state for a city outside the mock data', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'Curitiba');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' }),
    ).toBeInTheDocument();
  });

  it('keeps the selected unit in UI state and updates displayed temperatures', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await screen.findByRole('heading', { name: 'São Paulo' });
    await user.click(screen.getByRole('button', { name: 'Fahrenheit' }));

    expect(screen.getByText('72 °F')).toBeInTheDocument();
    expect(screen.getAllByText(/°F$/)).toHaveLength(12);
  });
});
