import { render } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';

// Mock all lazy-loaded pages
vi.mock('../pages/Landing', () => ({ default: () => <div data-testid="landing">Landing</div> }));
vi.mock('../pages/ParentDashboard', () => ({ default: () => <div>ParentDashboard</div> }));
vi.mock('../pages/ChildDashboard', () => ({ default: () => <div>ChildDashboard</div> }));
vi.mock('../pages/TutorChat', () => ({ default: () => <div>TutorChat</div> }));
vi.mock('../pages/Practice', () => ({ default: () => <div>Practice</div> }));
vi.mock('../pages/AdventureMap', () => ({ default: () => <div>AdventureMap</div> }));
vi.mock('../pages/WeeklyReport', () => ({ default: () => <div>WeeklyReport</div> }));
vi.mock('../pages/ChildSetup', () => ({ default: () => <div>ChildSetup</div> }));
vi.mock('../pages/AuthCallback', () => ({ default: () => <div>AuthCallback</div> }));

// Need to unmock react-router-dom for App to work with its own BrowserRouter
vi.unmock('react-router-dom');

describe('App', () => {
  test('renders without crashing', async () => {
    const { default: App } = await import('../App');
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
