export interface Household {
  id: string;
  churchId: string;
  name: string;
  primaryMemberId: string; // ID of the member who created it / head
  createdAt: any;
  updatedAt: any;
}

export interface DependentProfile {
  id: string;
  churchId: string;
  householdId: string;
  parentMemberId: string; // The registering member
  
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationshipToPrimaryMember: string; // e.g. "child"
  
  status: 'active' | 'inactive';
  
  createdAt: any;
  updatedAt: any;
}

