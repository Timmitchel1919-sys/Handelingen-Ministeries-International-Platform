/**
 * Handelingen Ministries International
 * Layer 2 - Church & Organization types
 */

export type ChurchStatus = 'active' | 'inactive' | 'pending';

export interface Church {
  id: string;
  name: string;
  shortName?: string;
  country: string;
  district: string;
  address?: string;
  phone?: string;
  email?: string;
  status: ChurchStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Ministry {
  id: string;
  churchId: string;
  name: string;
  description?: string;
  leaderIds: string[];
  status: 'active' | 'inactive';
  createdAt: number;
  updatedAt: number;
}

export interface Department {
  id: string;
  churchId: string;
  name: string;
  description?: string;
  leaderIds: string[];
  status: 'active' | 'inactive';
  createdAt: number;
  updatedAt: number;
}

export type MembershipStatus =
  | 'pending'
  | 'active'
  | 'inactive'
  | 'rejected'
  | 'suspended';

export interface ChurchMembership {
  id: string;
  churchId: string;
  userId: string;
  status: MembershipStatus;
  isPrimary: boolean;
  joinedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export const MINISTRY_INTERESTS = [
  'choir',
  'ushers',
  'media_tech',
  'youth',
  'children',
  'evangelism',
  'facility',
] as const;

export type MinistryInterest = (typeof MINISTRY_INTERESTS)[number];