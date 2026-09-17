export type MembershipStatus =
  | 'prospective'
  | 'active'
  | 'inactive'
  | 'transferred'
  | 'former'
  | 'deceased';

export interface EmergencyContact {
  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
}

export interface Member {
  id: string;
  userId?: string; // Links to Auth Profile (users/{uid})
  churchId: string;
  registrationId?: string; // If created from registration intake

  personal: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
  };

  contact: {
    email: string;
    phone: string;
  };

  address: {
    country: string;
    district: string;
    addressLine?: string;
  };

  membership: {
    status: MembershipStatus;
    memberType: string;
    joinedAt: any;
  };

  householdId?: string;
  householdRole?: 'head' | 'spouse' | 'child' | 'dependent' | 'other';

  ministryInterests: string[];

  emergencyContacts: EmergencyContact[];

  createdAt: any;
  updatedAt: any;
  createdBy?: string;
  updatedBy?: string;
}