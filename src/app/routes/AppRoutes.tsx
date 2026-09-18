import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { RequireAuth } from '@/app/routes/guards/RequireAuth';
import { RequireVerified } from '@/app/routes/guards/RequireVerified';
import { HomePage } from '@/features/home/HomePage';
import { SelectChurchPage } from '@/features/auth/pages/SelectChurchPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { ProfilePage } from '@/features/auth/pages/ProfilePage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { MembersPage } from '@/features/members/MembersPage';
import { LeadersPage } from '@/features/leaders/LeadersPage';
import { EventsRoutes } from '@/features/events/EventsRoutes';
import { DocumentsPage } from '@/features/documents/DocumentsPage';
import { TasksPage } from '@/features/tasks/TasksPage';
import { ReportsPage } from '@/features/reports/ReportsPage';
import { NotificationsPage } from '@/features/notifications/NotificationsPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { NotFoundPage } from '@/app/routes/NotFoundPage';
import { HRMRoutes } from '@/features/hrm/HRMRoutes';
import { OrganizationRoutes } from '@/features/organization/OrganizationRoutes';
import { ServingTeamsRoutes } from '@/features/serving-teams/ServingTeamsRoutes';
import { VolunteersRoutes } from '@/features/volunteers/VolunteersRoutes';
import { GroupsRoutes } from '@/features/groups/GroupsRoutes';
import { SchedulingRoutes } from '@/features/scheduling/SchedulingRoutes';
import { MyServingRoutes } from '@/features/my-serving/MyServingRoutes';

/**
 * Central route table.
 *
 * Route categories, per the Layer 1 spec (section 19):
 *  - Public: "/", "/select-church", "/register", "/login",
 *    "/forgot-password", "/reset-password" - no guard.
 *  - Authenticated: "/profile" - behind `RequireAuth` only.
 *  - Verified authenticated: every route inside `AppShell` (dashboard and
 *    the other navigation destinations) - behind `RequireAuth` AND
 *    `RequireVerified`.
 *  - Administrative: none of the current feature pages implement
 *    resource-level business logic yet, so none are gated by
 *    `RequirePermission` today; it exists (see guards/RequirePermission.tsx)
 *    for the first real administrative route (HRM, church management) in
 *    a later layer.
 *
 * "/verify-email" sits outside both guards: it's reached by an
 * authenticated-but-unverified user (a state `RequireVerified` redirects
 * to), so it can't itself require verification, and by design it doesn't
 * share the AppShell chrome (see AuthLayout).
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/select-church" element={<SelectChurchPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Authenticated (not necessarily verified) */}
      <Route element={<RequireAuth />}>
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route element={<AppShell />}>
          <Route path="/profile" element={<ProfilePage />} />

          {/* Verified authenticated: every other in-app destination */}
          <Route element={<RequireVerified />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/leaders" element={<LeadersPage />} />
            <Route path="/groups/*" element={<GroupsRoutes />} />
            <Route path="/events/*" element={<EventsRoutes />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/organization/*" element={<OrganizationRoutes />} />
            <Route path="/serving-teams/*" element={<ServingTeamsRoutes />} />
            <Route path="/volunteers/*" element={<VolunteersRoutes />} />
            <Route path="/hrm/*" element={<HRMRoutes />} />
            <Route path="/scheduling/*" element={<SchedulingRoutes />} />
            <Route path="/my-serving/*" element={<MyServingRoutes />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
