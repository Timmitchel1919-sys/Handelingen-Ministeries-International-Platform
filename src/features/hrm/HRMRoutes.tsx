import { Route, Routes } from 'react-router-dom';
import { RequirePermission } from '@/app/routes/guards/RequirePermission';

// We'll create these later
import { HRMOverviewPage } from './pages/HRMOverviewPage';
import { RegistrationIntakePage } from './pages/RegistrationIntakePage';
import { MemberDirectoryPage } from './pages/MemberDirectoryPage';
import { MemberProfilePage } from './pages/MemberProfilePage';
import { HouseholdsPage } from './pages/HouseholdsPage';
import { TransfersPage } from './pages/TransfersPage';

export function HRMRoutes() {
  return (
    <Routes>
      <Route element={<RequirePermission permission="hrm.manage" />}>
        <Route index element={<HRMOverviewPage />} />
        
        <Route element={<RequirePermission permission="registrations.manage" />}>
          <Route path="registrations" element={<RegistrationIntakePage />} />
        </Route>
        
        <Route element={<RequirePermission permission="members.manage" />}>
          <Route path="members" element={<MemberDirectoryPage />} />
          <Route path="members/:memberId" element={<MemberProfilePage />} />
        </Route>

        <Route element={<RequirePermission permission="households.manage" />}>
          <Route path="households" element={<HouseholdsPage />} />
        </Route>

        <Route element={<RequirePermission permission="transfers.manage" />}>
          <Route path="transfers" element={<TransfersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
