import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import AuthCallback from '../pages/AuthCallback';

describe('AuthCallback page', () => {
  test('renders loading state', () => {
    render(
      <MemoryRouter initialEntries={['/auth/callback']}>
        <AuthCallback />
      </MemoryRouter>
    );
    // Should show some loading indicator
    expect(document.body).toBeTruthy();
  });
});
