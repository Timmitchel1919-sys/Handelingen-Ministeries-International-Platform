import { Route, Routes } from 'react-router-dom';
import { VolunteerDirectoryPage } from './VolunteerDirectoryPage';
import { VolunteerProfilePage } from './VolunteerProfilePage';

export function VolunteersRoutes() {
  return (
    <Routes>
      <Route path="/" element={<VolunteerDirectoryPage />} />
      <Route path="/:memberId" element={<VolunteerProfilePage />} />
    </Routes>
  );
}

