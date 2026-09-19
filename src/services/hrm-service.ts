import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase';
import type { MemberRegistration } from '@/types/registration';
import type { Member } from '@/types/member';
import { getUserProfile } from './user-profile-service';

export async function approveRegistration(registrationId: string, actorUid: string) {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore not initialized');

  const actorProfile = await getUserProfile(actorUid);
  const regRef = doc(db, 'memberRegistrations', registrationId);
  const newMemberRef = doc(collection(db, 'members'));

  await runTransaction(db, async (t) => {
    const regSnap = await t.get(regRef);
    if (!regSnap.exists()) throw new Error('Registration not found');

    const reg = regSnap.data() as MemberRegistration;

    if (reg.status === 'approved') {
      // Idempotent
      return;
    }

    if (reg.status !== 'under_review' && reg.status !== 'verified') {
      throw new Error(`Cannot approve registration in status: ${reg.status}`);
    }

    // Prepare member document
    const newMember: Omit<Member, 'id'> = {
      userId: reg.uid,
      churchId: reg.churchId,
      registrationId: regSnap.id,

      personal: {
        firstName: reg.firstName,
        lastName: reg.lastName,
        dateOfBirth: reg.dateOfBirth,
        gender: reg.gender,
        maritalStatus: reg.maritalStatus,
        isBaptized: reg.isBaptized,
      },

      contact: {
        email: reg.email,
        phone: reg.phone,
      },

      address: {
        country: reg.country,
        district: reg.district,
      },

      membership: {
        status: 'active',
        memberType: reg.memberType,
        joinedAt: serverTimestamp(),
      },

      ministryInterests: reg.ministryInterest ? [reg.ministryInterest] : [],

      emergencyContacts: [reg.emergencyContact1, reg.emergencyContact2].filter(Boolean) as any,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: actorUid,
      updatedBy: actorUid,
    };

    // Update registration
    t.update(regRef, {
      status: 'approved',
      reviewedBy: actorUid,
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Create member
    t.set(newMemberRef, newMember);

    // Create household and children if needed
    if (reg.hasChildren && reg.children && reg.children.length > 0) {
      const householdRef = doc(collection(db, 'households'));
      t.set(householdRef, {
        churchId: reg.churchId,
        name: `${reg.lastName} Household`,
        primaryMemberId: newMemberRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update primary member with householdId
      t.update(newMemberRef, {
        householdId: householdRef.id,
        householdRole: 'head',
      });

      // Create dependent profiles for children
      reg.children.forEach(child => {
        const childRef = doc(collection(db, 'dependentProfiles'));
        t.set(childRef, {
          churchId: reg.churchId,
          householdId: householdRef.id,
          parentMemberId: newMemberRef.id,
          firstName: child.firstName,
          lastName: child.lastName,
          dateOfBirth: child.dateOfBirth,
          relationshipToPrimaryMember: 'child',
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
    }

    // Audit log
    const auditRef = doc(collection(db, 'auditLogs'));
    t.set(auditRef, {
      actorUid,
      actorRole: actorProfile?.role || 'unknown',
      action: 'registration-approved',
      resource: 'memberRegistrations',
      resourceId: regSnap.id,
      churchId: reg.churchId,
      createdAt: serverTimestamp(),
    });
  });
}

export async function rejectRegistration(registrationId: string, actorUid: string, reason: string) {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore not initialized');

  const actorProfile = await getUserProfile(actorUid);
  const regRef = doc(db, 'memberRegistrations', registrationId);

  await runTransaction(db, async (t) => {
    const regSnap = await t.get(regRef);
    if (!regSnap.exists()) throw new Error('Registration not found');

    const reg = regSnap.data() as MemberRegistration;

    if (reg.status === 'rejected') return;

    if (reg.status !== 'under_review' && reg.status !== 'verified') {
      throw new Error(`Cannot reject registration in status: ${reg.status}`);
    }

    t.update(regRef, {
      status: 'rejected',
      decisionReason: reason,
      reviewedBy: actorUid,
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Audit log
    const auditRef = doc(collection(db, 'auditLogs'));
    t.set(auditRef, {
      actorUid,
      actorRole: actorProfile?.role || 'unknown',
      action: 'registration-rejected',
      resource: 'memberRegistrations',
      resourceId: regSnap.id,
      churchId: reg.churchId,
      createdAt: serverTimestamp(),
    });
  });
}
