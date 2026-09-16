import type {
  BaseEntity,
  Gender,
  MembershipStatus,
} from './common';

export interface Member extends BaseEntity {
  churchId: string;

  userId?: string;

  firstName: string;

  middleName?: string;

  lastName: string;

  displayName: string;

  email: string;

  phone?: string;

  dateOfBirth?: string;

  gender?: Gender;

  address?: {
    street?: string;
    city?: string;
    district?: string;
    country?: string;
  };

  membershipStatus: MembershipStatus;

  membershipDate?: string;

  baptismDate?: string;

  ministryIds: string[];

  departmentIds: string[];

  photoUrl?: string;

  emergencyContact?: {
    name: string;
    relationship?: string;
    phone: string;
  };

  notes?: string;
}