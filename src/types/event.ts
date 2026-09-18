export type EventType =
  | 'CHURCH_SERVICE'
  | 'SPECIAL_SERVICE'
  | 'PRAYER_MEETING'
  | 'BIBLE_STUDY'
  | 'CONFERENCE'
  | 'MINISTRY_EVENT'
  | 'DEPARTMENT_EVENT'
  | 'LEADERSHIP_MEETING'
  | 'TRAINING'
  | 'OUTREACH'
  | 'MISSION'
  | 'YOUTH_EVENT'
  | 'CHILDREN_EVENT'
  | 'VOLUNTEER_EVENT'
  | 'COMMUNITY_EVENT'
  | 'OTHER';

export type EventStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ONGOING'
  | 'COMPLETED'
  | 'CANCELLED';

export type EventVisibility =
  | 'PUBLIC'
  | 'MEMBERS'
  | 'CHURCH_ONLY'
  | 'MINISTRY_ONLY'
  | 'DEPARTMENT_ONLY'
  | 'LEADERSHIP_ONLY'
  | 'PRIVATE';

export type EventScope =
  | 'GLOBAL'
  | 'REGION'
  | 'COUNTRY'
  | 'CHURCH'
  | 'MINISTRY'
  | 'DEPARTMENT';

export type RegistrationStatus =
  | 'REGISTERED'
  | 'WAITLISTED'
  | 'CANCELLED'
  | 'ATTENDED'
  | 'NO_SHOW';

export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'EXCUSED'
  | 'CHECKED_IN';

export type RecurrenceType =
  | 'NONE'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'CUSTOM';

export interface ChurchEvent {
  id: string;

  // Scoping
  churchId: string;
  scope: EventScope;
  ministryId?: string | null;
  departmentId?: string | null;

  // Core details
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  visibility: EventVisibility;

  // People
  organizerIds?: string[];
  speakerIds?: string[];

  // Schedule
  startAt: string; // ISO string for frontend, converted to Firestore Timestamp on backend
  endAt: string;
  timezone: string;

  // Recurrence
  recurrenceType: RecurrenceType;
  recurrenceEndDate?: string | null;
  recurrenceCount?: number | null;
  parentEventId?: string | null; // If this is an instance of a recurring event

  // Location & Online
  locationType: 'PHYSICAL' | 'ONLINE' | 'HYBRID';
  venueName?: string | null;
  address?: string | null;
  district?: string | null;
  country?: string | null;
  onlineMeetingUrl?: string | null;
  meetingId?: string | null;
  isLiveEnabled?: boolean;
  liveStatus?: 'OFFLINE' | 'LIVE' | 'RECORDING_AVAILABLE';
  livestreamUrl?: string | null;

  // Registration
  registrationRequired: boolean;
  capacity?: number | null;
  registeredCount: number;
  registrationDeadline?: string | null;

  // Attendance
  attendanceEnabled: boolean;

  // Audit
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  churchId: string;
  memberId: string;
  status: RegistrationStatus;
  registeredAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  churchId: string;
  memberId: string;
  status: AttendanceStatus;
  checkInTime?: string | null;
  recordedBy: string;
  recordedAt: string;
  updatedAt: string;
}