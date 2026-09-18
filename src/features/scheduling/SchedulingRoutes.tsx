import { Route, Routes } from 'react-router-dom';
import { SchedulingBoardPage } from './SchedulingBoardPage';
import { TeamLeaderDashboardPage } from './TeamLeaderDashboardPage';

export function SchedulingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SchedulingBoardPage />} />
      <Route path="/team-leader" element={<TeamLeaderDashboardPage />} />
    </Routes>
  );
}

