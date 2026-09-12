import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { getFirebaseFirestore } from '@/lib/firebase';
import type { Church } from '@/types/church';

function requireFirestore() {
  const db = getFirebaseFirestore();

  if (!db) {
    throw new Error('Firebase is not configured.');
  }

  return db;
}

function mapChurch(
  id: string,
  data: Record<string, unknown>,
): Church {
  return {
    id,
    name: String(data.name ?? ''),
    shortName: data.shortName ? String(data.shortName) : undefined,
    country: String(data.country ?? ''),
    district: String(data.district ?? ''),
    address: data.address ? String(data.address) : undefined,
    phone: data.phone ? String(data.phone) : undefined,
    email: data.email ? String(data.email) : undefined,
    status:
      data.status === 'inactive' || data.status === 'pending'
        ? data.status
        : 'active',
    createdAt: Number(data.createdAt ?? 0),
    updatedAt: Number(data.updatedAt ?? 0),
  };
}

export async function getActiveChurches(): Promise<Church[]> {
  const db = requireFirestore();

  const churchesQuery = query(
    collection(db, 'churches'),
    where('status', '==', 'active'),
    orderBy('name', 'asc'),
  );

  const snapshot = await getDocs(churchesQuery);

  return snapshot.docs.map((churchDoc) =>
    mapChurch(churchDoc.id, churchDoc.data()),
  );
}

export async function getChurchById(
  churchId: string,
): Promise<Church | null> {
  if (!churchId.trim()) {
    return null;
  }

  const db = requireFirestore();

  const churchRef = doc(db, 'churches', churchId);
  const snapshot = await getDoc(churchRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapChurch(snapshot.id, snapshot.data());
}

export async function validateActiveChurch(
  churchId: string,
): Promise<Church | null> {
  const church = await getChurchById(churchId);

  if (!church || church.status !== 'active') {
    return null;
  }

  return church;
}