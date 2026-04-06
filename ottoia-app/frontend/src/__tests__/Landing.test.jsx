import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';

// Lazy-loaded in App, so import directly
import Landing from '../pages/Landing';

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('Landing page', () => {
  test('renders without crashing', () => {
    renderWithRouter(<Landing />);
  });

  test('displays OttoAI brand name', () => {
    renderWithRouter(<Landing />);
    expect(screen.getAllByText(/OttoAI/i).length).toBeGreaterThan(0);
  });

  test('has login button', () => {
    renderWithRouter(<Landing />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('shows subject pills', () => {
    renderWithRouter(<Landing />);
    expect(screen.getByText(/Matem/i)).toBeInTheDocument();
    expect(screen.getByText(/Lengua/i)).toBeInTheDocument();
  });
});
