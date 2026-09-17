import { collection, doc, setDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase';
import type { MemberRegistration } from '@/types/registration';

export async function createMemberRegistration(params: Omit<MemberRegistration, 'id' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'schemaVersion' | 'status'>) {
  const db = getFirebaseFirestore();
  if (!db) throw new Error('Firestore not initialized');

  // Double check if a registration already exists for this UID
  const q = query(collection(db, 'memberRegistrations'), where('uid', '==', params.uid));
  const existing = await getDocs(q);
  
  if (!existing.empty) {
    // Already has a registration. Don't create another one.
    // For idempotency, we can just return or throw.
    return;
  }

  // Create new registration record
  const registrationRef = doc(collection(db, 'memberRegistrations'));
  
  const registrationData: Partial<MemberRegistration> = {
    ...params,
    id: registrationRef.id,
    status: 'email_verification_pending',
    schemaVersion: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    submittedAt: serverTimestamp(),
  };

  await setDoc(registrationRef, registrationData);
}

export async function markRegistrationVerified(uid: string) {
  const db = getFirebaseFirestore();
  if (!db) return;
  
  const q = query(collection(db, 'memberRegistrations'), where('uid', '==', uid), where('status', '==', 'email_verification_pending'));
  const snap = await getDocs(q);
  
  if (snap.empty) return;

  const registration = snap.docs[0];
  const registrationRef = doc(db, 'memberRegistrations', registration.id);

  // We should update it using updateDoc. But let's use setDoc merge just to be sure.
  await setDoc(registrationRef, {
    status: 'verified',
    emailVerifiedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
