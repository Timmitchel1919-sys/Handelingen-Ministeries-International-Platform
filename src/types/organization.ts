import type { BaseEntity, FirestoreTimestamp } from './common';

export type OrganizationType = 'ministry' | 'department' | 'team';

export type OrganizationMembershipStatus = 'active' | 'inactive' | 'ended';

export interface OrganizationMembership extends BaseEntity {
  churchId: string;
  memberId: string;
  
  organizationType: OrganizationType;
  organizationId: string;
  
  role: string; // e.g., 'member', 'worker', 'volunteer', 'coordinator'
  
  status: OrganizationMembershipStatus;
  
  startDate: FirestoreTimestamp;
  endDate?: FirestoreTimestamp | null;
  
  assignedBy?: string;
}

export interface LeadershipAssignment extends BaseEntity {
  churchId: string;
  memberId: string;
  
  organizationType: OrganizationType;
  organizationId: string;
  
  role: string; // e.g., 'leader', 'assistant_leader'
  
  status: OrganizationMembershipStatus; // active, ended
  
  startDate: FirestoreTimestamp;
  endDate?: FirestoreTimestamp | null;
  
  assignedBy?: string;
}

