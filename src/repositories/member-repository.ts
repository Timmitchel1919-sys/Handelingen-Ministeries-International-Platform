import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type Firestore,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import {
  getFirebaseAuth,
  getFirebaseFirestore,
} from '@/lib/firebase';

import type { Member } from '@/types/member';
import { getUserProfile } from '@/services/user-profile-service';

const COLLECTION = 'members';

function requireFirestore(): Firestore {
  const firestore = getFirebaseFirestore();

  if (!firestore) {
    throw new Error(
      'Firestore is not configured.',
    );
  }

  return firestore;
}

function requireCurrentUserId(): string {
  const auth = getFirebaseAuth();

  const user = auth?.currentUser;

  if (!user) {
    throw new Error(
      'Authentication required.',
    );
  }

  return user.uid;
}

function toMember(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): Member {
  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as Member;
}

export async function getCurrentMember(): Promise<Member | null> {
  const uid = requireCurrentUserId();
  const profile = await getUserProfile(uid);
  if (!profile?.churchId) return null;

  const firestore = requireFirestore();

  const memberQuery = query(
    collection(firestore, COLLECTION),
    where('userId', '==', uid),
    where('churchId', '==', profile.churchId),
    limit(1),
  );

  const snapshot =
    await getDocs(memberQuery);

  if (snapshot.empty) {
    return null;
  }

  return toMember(snapshot.docs[0]);
}

export async function getMemberById(
  memberId: string,
): Promise<Member | null> {
  requireCurrentUserId();

  const firestore = requireFirestore();

  const snapshot = await getDoc(
    doc(
      firestore,
      COLLECTION,
      memberId,
    ),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as Member;
}

export async function getChurchMembers(
  churchId: string,
): Promise<Member[]> {
  requireCurrentUserId();

  const firestore = requireFirestore();

  const memberQuery = query(
    collection(firestore, COLLECTION),
    where('churchId', '==', churchId),
    where(
      'membershipStatus',
      '==',
      'active',
    ),
    orderBy('lastName', 'asc'),
  );

  const snapshot =
    await getDocs(memberQuery);

  return snapshot.docs.map(toMember);
}
