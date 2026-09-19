export type RegistrationStatus =
  | 'draft'
  | 'submitted'
  | 'email_verification_pending'
  | 'verified'
  | 'under_review'
  | 'correction_requested'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export interface EmergencyContact {
  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
}

export interface ChildRegistration {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface MemberRegistration {
  id: string;
  uid: string;
  churchId: string;
  status: RegistrationStatus;

  // Form Fields
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  memberType: string;

  isBaptized?: boolean;
  hasChildren?: boolean;
  children?: ChildRegistration[];

  country: string;
  district: string;
  phone: string;
  email: string;

  emergencyContact1: EmergencyContact | null;
  emergencyContact2: EmergencyContact | null;

  ministryInterest: string;
  howDidYouHear: string;

  // Timestamps and Metadata
  createdAt: any;
  updatedAt: any;
  submittedAt: any;
  emailVerifiedAt?: any;
  reviewedAt?: any;
  reviewedBy?: string;
  decisionReason?: string;
  schemaVersion: number;
}
