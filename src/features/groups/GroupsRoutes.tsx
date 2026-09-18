import { Route, Routes } from 'react-router-dom';
import { GroupsDashboardPage } from './pages/GroupsDashboardPage';
import { CreateGroupPage } from './pages/CreateGroupPage';
import { GroupDetailsPage } from './pages/GroupDetailsPage';
import { EditGroupPage } from './pages/EditGroupPage';

export function GroupsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GroupsDashboardPage />} />
      <Route path="/new" element={<CreateGroupPage />} />
      <Route path="/:groupId" element={<GroupDetailsPage />} />
      <Route path="/:groupId/edit" element={<EditGroupPage />} />
    </Routes>
  );
}

