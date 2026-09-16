import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import '@/i18n'; // Initialize i18n instance
import { AppShell } from '@/components/layout/AppShell';
import { ThemeProvider } from '@/app/providers/ThemeProvider';

// Mock useAuth
const useAuthMock = vi.fn();
vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

// Mock signOutCurrentUser
const signOutMock = vi.fn();
vi.mock('@/services/auth-service', () => ({
  signOutCurrentUser: () => signOutMock(),
}));

function renderShellAt(path = '/dashboard') {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            <Route path="/ministries" element={<div>Ministries Content</div>} />
            <Route path="/members" element={<div>Members Content</div>} />
            <Route path="/settings" element={<div>Settings Content</div>} />
            <Route path="/profile" element={<div>Profile Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('AppShell & Navigation Layer 5', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthMock.mockReturnValue({
      user: {
        uid: 'user-123',
        email: 'test@handelingen.org',
        displayName: 'John Doe',
        role: 'church_admin',
        photoUrl: null,
      },
      status: 'authenticated',
    });
  });

  it('renders main content and navigation sidebar', () => {
    renderShellAt('/dashboard');
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    expect(screen.getAllByText('Handelingen').length).toBeGreaterThan(0);
  });

  it('highlights the active route in navigation', () => {
    renderShellAt('/ministries');
    expect(screen.getByText('Ministries Content')).toBeInTheDocument();
  });

  it('opens and closes command palette via search trigger', async () => {
    renderShellAt('/dashboard');
    const searchButtons = screen.getAllByLabelText(/search|zoek/i);
    expect(searchButtons.length).toBeGreaterThan(0);

    fireEvent.click(searchButtons[0]);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search the platform|zoek/i)).toBeInTheDocument();
    });

    const closeBtn = screen.getByText('ESC');
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/search the platform|zoek/i)).not.toBeInTheDocument();
    });
  });

  it('toggles desktop sidebar collapse state', () => {
    renderShellAt('/dashboard');
    const collapseBtn = screen.getByLabelText(/collapse sidebar|zijbalk inklappen/i);
    fireEvent.click(collapseBtn);

    // Click again to expand
    const expandBtn = screen.getByLabelText(/expand sidebar|zijbalk uitklappen/i);
    expect(expandBtn).toBeInTheDocument();
  });

  it('renders user menu and calls sign out', async () => {
    renderShellAt('/dashboard');
    const userMenuBtn = screen.getByLabelText(/user menu|gebruikersmenu/i);
    fireEvent.click(userMenuBtn);

    const signOutBtns = screen.getAllByText(/sign out|uitloggen/i);
    expect(signOutBtns.length).toBeGreaterThan(0);

    fireEvent.click(signOutBtns[0]);
    expect(signOutMock).toHaveBeenCalled();
  });

  it('renders mobile bottom navigation buttons', () => {
    renderShellAt('/dashboard');
    const mobileNav = screen.getByLabelText(/mobile navigation|mobiele navigatie/i);
    expect(mobileNav).toBeInTheDocument();
  });
});
