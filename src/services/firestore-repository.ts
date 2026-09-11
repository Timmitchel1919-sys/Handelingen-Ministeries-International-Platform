import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as fsLimit,
  query,
  startAfter,
  updateDoc,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import { getFirebaseFirestore } from '@/lib/firebase';
import type { AppError, Paginated } from '@/types/common';

/**
 * Generic Firestore repository.
 *
 * Layer 0 establishes the data-access pattern - UI components must never
 * call Firestore directly; they go through a repository like this one (or
 * a feature-specific repository built on top of it). Every method returns
 * a normalized `AppError` on failure instead of throwing a raw Firebase
 * error, so callers (and ultimately `ErrorState`) never handle provider
 * internals.
 *
 * Authorization is NOT enforced here - it must be enforced server-side via
 * Firestore Security Rules. This layer only shapes requests/responses.
 */
function isAppError(value: unknown): value is AppError {
  return typeof value === 'object' && value !== null && 'kind' in value && 'message' in value;
}

function toAppError(cause: unknown): AppError {
  if (isAppError(cause)) return cause;
  const code = (cause as { code?: string })?.code;
  if (code === 'permission-denied') return { kind: 'authorization', message: 'Not allowed.', cause };
  if (code === 'unauthenticated') return { kind: 'auth', message: 'Sign-in required.', cause };
  if (code === 'not-found') return { kind: 'not-found', message: 'Not found.', cause };
  return { kind: 'unknown', message: 'Something went wrong.', cause };
}

export class FirestoreRepository<T extends DocumentData> {
  private readonly collectionPath: string;

  constructor(collectionPath: string) {
    this.collectionPath = collectionPath;
  }

  private requireDb() {
    const db = getFirebaseFirestore();
    if (!db) {
      throw { kind: 'network', message: 'Firebase is not configured.' } satisfies AppError;
    }
    return db;
  }

  async getById(id: string): Promise<T & { id: string }> {
    try {
      const db = this.requireDb();
      const snapshot = await getDoc(doc(db, this.collectionPath, id));
      if (!snapshot.exists()) throw { code: 'not-found' };
      return { id: snapshot.id, ...(snapshot.data() as T) };
    } catch (cause) {
      throw toAppError(cause);
    }
  }

  async list(constraints: QueryConstraint[] = [], pageSize = 25): Promise<Paginated<T & { id: string }>> {
    try {
      const db = this.requireDb();
      const snapshot = await getDocs(query(collection(db, this.collectionPath), ...constraints, fsLimit(pageSize)));
      const items = snapshot.docs.map((docSnap: QueryDocumentSnapshot) => ({
        id: docSnap.id,
        ...(docSnap.data() as T),
      }));
      const last = snapshot.docs.at(-1);
      return { items, nextCursor: last ? last.id : null };
    } catch (cause) {
      throw toAppError(cause);
    }
  }

  async listAfter(
    cursor: string,
    constraints: QueryConstraint[] = [],
    pageSize = 25,
  ): Promise<Paginated<T & { id: string }>> {
    try {
      const db = this.requireDb();
      const cursorSnap = await getDoc(doc(db, this.collectionPath, cursor));
      const snapshot = await getDocs(
        query(collection(db, this.collectionPath), ...constraints, startAfter(cursorSnap), fsLimit(pageSize)),
      );
      const items = snapshot.docs.map((docSnap: QueryDocumentSnapshot) => ({
        id: docSnap.id,
        ...(docSnap.data() as T),
      }));
      const last = snapshot.docs.at(-1);
      return { items, nextCursor: last ? last.id : null };
    } catch (cause) {
      throw toAppError(cause);
    }
  }

  async create(data: T): Promise<string> {
    try {
      const db = this.requireDb();
      const ref = await addDoc(collection(db, this.collectionPath), data);
      return ref.id;
    } catch (cause) {
      throw toAppError(cause);
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const db = this.requireDb();
      await updateDoc(doc(db, this.collectionPath, id), data as DocumentData);
    } catch (cause) {
      throw toAppError(cause);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const db = this.requireDb();
      await deleteDoc(doc(db, this.collectionPath, id));
    } catch (cause) {
      throw toAppError(cause);
    }
  }
}
