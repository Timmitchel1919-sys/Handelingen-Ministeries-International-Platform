import { Routes, Route } from 'react-router-dom';
import { EventsDashboardPage } from './pages/EventsDashboardPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { EditEventPage } from './pages/EditEventPage';
import { EventAttendancePage } from './pages/EventAttendancePage';

export function EventsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EventsDashboardPage />} />
      <Route path="/new" element={<CreateEventPage />} />
      <Route path="/:eventId" element={<EventDetailsPage />} />
      <Route path="/:eventId/edit" element={<EditEventPage />} />
      <Route path="/:eventId/attendance" element={<EventAttendancePage />} />
    </Routes>
  );
}
