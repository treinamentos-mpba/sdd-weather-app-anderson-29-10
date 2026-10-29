import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from '../../src/components/states/EmptyState';
import ErrorState from '../../src/components/states/ErrorState';
import LoadingState from '../../src/components/states/LoadingState';

describe('state components', () => {
  it('announces loading content as a status', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
  });

  it('shows the error message and invokes retry', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Não foi possível consultar o clima." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível consultar o clima.');
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders the empty title and tip', () => {
    render(<EmptyState title="Sem cidades" tip="Tente buscar por outra grafia." />);

    expect(screen.getByRole('heading', { name: 'Sem cidades' })).toBeInTheDocument();
    expect(screen.getByText('Tente buscar por outra grafia.')).toBeInTheDocument();
  });
});
