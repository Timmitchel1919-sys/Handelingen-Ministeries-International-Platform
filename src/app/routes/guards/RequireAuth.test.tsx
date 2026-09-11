import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RequireAuth } from '@/app/routes/guards/RequireAuth';

const useAuthMock = vi.fn();
vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>login page</div>} />
        <Route element={<RequireAuth />}>
          <Route path="/profile" element={<div>profile page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAuth', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it('shows a loading state while auth status is unresolved', () => {
    useAuthMock.mockReturnValue({ status: 'loading' });
    renderAt('/profile');
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('profile page')).not.toBeInTheDocument();
  });

  it('redirects an unauthenticated visitor to /login', () => {
    useAuthMock.mockReturnValue({ status: 'unauthenticated' });
    renderAt('/profile');
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('profile page')).not.toBeInTheDocument();
  });

  it('renders the protected route for an authenticated user', () => {
    useAuthMock.mockReturnValue({ status: 'authenticated' });
    renderAt('/profile');
    expect(screen.getByText('profile page')).toBeInTheDocument();
  });
});
