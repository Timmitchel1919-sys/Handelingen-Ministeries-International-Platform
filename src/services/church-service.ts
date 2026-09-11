import { collection, doc, serverTimestamp, setDoc, where } from 'firebase/firestore';

import { getFirebaseFirestore } from '@/lib/firebase';
import { FirestoreRepository } from '@/services/firestore-repository';
import type { Church } from '@/types/church';
import type { AppError } from '@/types/common';

const CHURCHES_COLLECTION = 'churches';

const churchRepository = new FirestoreRepository<Omit<Church, 'id'>>(CHURCHES_COLLECTION);

/** Public-facing church list for the "choose your church" step of
 * registration. Firestore rules restrict this read to churches whose
 * status is "active" (see firestore.rules) - a church being inactive isn't
 * just a UI filter. */
export async function listActiveChurches(): Promise<Church[]> {
  const page = await churchRepository.list([where('status', '==', 'active')], 100);
  return page.items;
}

/** Re-validates a client-supplied churchId against Firestore before it's
 * trusted anywhere (registration, church context). Never accept a church
 * name from the client as the source of truth - only this lookup result. */
export async function getActiveChurchById(churchId: string): Promise<Church | null> {
  try {
    const church = await churchRepository.getById(churchId);
    return church.status === 'active' ? church : null;
  } catch (cause) {
    if ((cause as AppError).kind === 'not-found') return null;
    throw cause;
  }
}

/** Seeds a church document. Intended for initial/administrative setup
 * (e.g. the first church of a new deployment) - ordinary church creation
 * in later layers should route through an authorized HRM/church-management
 * flow rather than calling this directly from arbitrary UI. */
export async function createChurch(name: string): Promise<string> {
  const db = getFirebaseFirestore();
  if (!db) throw { kind: 'network', message: 'Firebase is not configured.' } satisfies AppError;

  const newDocRef = doc(collection(db, CHURCHES_COLLECTION));
  await setDoc(newDocRef, {
    name,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return newDocRef.id;
}
