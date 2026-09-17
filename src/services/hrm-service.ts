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
