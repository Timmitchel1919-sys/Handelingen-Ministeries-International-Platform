import { Routes, Route } from 'react-router-dom';
import { OrganizationDashboardPage } from './pages/OrganizationDashboardPage';
import { PlaceholderPage } from '@/components/shared/PlaceholderPage';

export function OrganizationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OrganizationDashboardPage />} />
      <Route path="ministries/*" element={<PlaceholderPage titleKey="Ministries" icon="ministries" />} />
      <Route path="departments/*" element={<PlaceholderPage titleKey="Departments" icon="departments" />} />
      <Route path="teams/*" element={<PlaceholderPage titleKey="Teams" icon="users" />} />
    </Routes>
  );
}

export default OrganizationRoutes;
