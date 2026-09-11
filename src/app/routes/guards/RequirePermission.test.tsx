import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RequirePermission } from '@/app/routes/guards/RequirePermission';

const useAuthMock = vi.fn();
vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<RequirePermission permission="settings.manage" />}>
          <Route path="/settings" element={<div>settings page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequirePermission', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it('renders an access-denied message (not a redirect) for an unauthorized user', () => {
    useAuthMock.mockReturnValue({ hasPermission: () => false });
    renderAt('/settings');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByText('settings page')).not.toBeInTheDocument();
  });

  it('renders the route for an authorized user', () => {
    useAuthMock.mockReturnValue({ hasPermission: () => true });
    renderAt('/settings');
    expect(screen.getByText('settings page')).toBeInTheDocument();
  });
});
