import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RequireVerified } from '@/app/routes/guards/RequireVerified';

const useAuthMock = vi.fn();
vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/verify-email" element={<div>verify email page</div>} />
        <Route path="/profile" element={<div>profile page</div>} />
        <Route element={<RequireVerified />}>
          <Route path="/dashboard" element={<div>dashboard page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireVerified', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it('redirects to /verify-email when the user has not verified their email', () => {
    useAuthMock.mockReturnValue({ user: { emailVerified: false } });
    renderAt('/dashboard');
    expect(screen.getByText('verify email page')).toBeInTheDocument();
    expect(screen.queryByText('dashboard page')).not.toBeInTheDocument();
  });

  it('redirects to /verify-email when there is no user at all', () => {
    useAuthMock.mockReturnValue({ user: null });
    renderAt('/dashboard');
    expect(screen.getByText('verify email page')).toBeInTheDocument();
  });

  it('renders the protected route once the email is verified', () => {
    useAuthMock.mockReturnValue({ user: { emailVerified: true, accountStatus: 'active', churchId: 'church-a' } });
    renderAt('/dashboard');
    expect(screen.getByText('dashboard page')).toBeInTheDocument();
  });

  it.each(['pending', 'suspended', 'disabled'])('blocks a verified %s account', (accountStatus) => {
    useAuthMock.mockReturnValue({ user: { emailVerified: true, accountStatus, churchId: 'church-a' } });
    renderAt('/dashboard');
    expect(screen.getByText('profile page')).toBeInTheDocument();
    expect(screen.queryByText('dashboard page')).not.toBeInTheDocument();
  });
});
