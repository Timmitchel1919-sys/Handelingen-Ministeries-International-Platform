export type GroupType =
  | 'BIBLE_STUDY'
  | 'PRAYER'
  | 'HOME_GROUP'
  | 'YOUTH'
  | 'YOUNG_ADULTS'
  | 'MEN'
  | 'WOMEN'
  | 'MARRIAGE'
  | 'DISCIPLESHIP'
  | 'LEADERSHIP'
  | 'OTHER';

export type GroupMembershipStatus = 'INVITED' | 'ACTIVE' | 'INACTIVE' | 'LEFT' | 'REMOVED';
export type GroupRole = 'MEMBER' | 'LEADER' | 'ASSISTANT_LEADER';
export type GroupStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Group {
  id: string;
  churchId: string;
  name: string;
  description: string;
  groupType: GroupType;
  ministryId: string | null;
  departmentId: string | null;
  leaderMemberId: string;
  assistantLeaderMemberIds: string[];
  meetingSchedule: string;
  location: string;
  capacity: number | null;
  visibility: 'PUBLIC' | 'PRIVATE';
  status: GroupStatus;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface GroupMembership {
  id: string;
  churchId: string;
  groupId: string;
  memberId: string;
  role: GroupRole;
  status: GroupMembershipStatus;
  joinedAt: number;
}

export type VolunteerStatus = 'INTERESTED' | 'PENDING' | 'ACTIVE' | 'PAUSED' | 'INACTIVE';

export interface VolunteerProfile {
  memberId: string; // Used as the document ID
  churchId: string;
  status: VolunteerStatus;
  skills: string[];
  interests: string[];
  preferredRoles: string[];
  availability: string;
  unavailableDates: string[]; // ISO dates
  notes: string;
  approvedBy: string | null;
  approvedAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export type ServingTeamStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface ServingTeam {
  id: string;
  churchId: string;
  name: string;
  description: string;
  ministryId: string | null;
  departmentId: string | null;
  teamLeaderMemberId: string | null;
  status: ServingTeamStatus;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface ServingRole {
  id: string;
  churchId: string;
  teamId: string;
  name: string;
  qualifications: string[]; 
}

export type AssignmentStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface ServiceAssignment {
  id: string;
  eventId: string;
  churchId: string;
  teamId: string;
  roleId: string;
  memberId: string;
  status: AssignmentStatus;
  assignedBy: string;
  assignedAt: number;
  declinedReason: string | null;
}

