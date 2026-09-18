import { Route, Routes } from 'react-router-dom';
import { ServingTeamsDashboardPage } from './ServingTeamsDashboardPage';
import { CreateServingTeamPage } from './CreateServingTeamPage';
import { TeamDetailsPage } from './TeamDetailsPage';

export function ServingTeamsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ServingTeamsDashboardPage />} />
      <Route path="/new" element={<CreateServingTeamPage />} />
      <Route path="/:teamId" element={<TeamDetailsPage />} />
    </Routes>
  );
}

