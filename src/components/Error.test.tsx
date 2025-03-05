import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Error from './Error';

describe('Error Component', () => {
  it('renders 404 error page correctly', () => {
    render(
      <BrowserRouter>
        <Error code={404} />
      </BrowserRouter>
    );

    expect(screen.getByText('404')).toBeDefined();
    expect(screen.getByText('Az oldal nem található')).toBeDefined();
    expect(screen.getByText('Vissza')).toBeDefined();
    expect(screen.getByText('Főoldal')).toBeDefined();
  });

  it('renders 403 error page correctly', () => {
    render(
      <BrowserRouter>
        <Error code={403} />
      </BrowserRouter>
    );

    expect(screen.getByText('403')).toBeDefined();
    expect(screen.getByText('Hozzáférés megtagadva')).toBeDefined();
  });

  it('renders 500 error page correctly', () => {
    render(
      <BrowserRouter>
        <Error code={500} />
      </BrowserRouter>
    );

    expect(screen.getByText('500')).toBeDefined();
    expect(screen.getByText('Szerver hiba')).toBeDefined();
  });
}); 