import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';
import { type FirebaseStorage, getStorage } from 'firebase/storage';

import { firebaseConfig, isFirebaseConfigured } from '@/app/config/env.config';

/**
 * Firebase client foundation.
 *
 * Layer 0 wires up initialization only - Authentication, Firestore and
 * Storage handles are exported for later layers to build real
 * services/repositories on top of. All authorization-sensitive logic must
 * still be enforced server-side via Firestore/Storage Security Rules and
 * Cloud Functions; nothing here should be treated as a trust boundary.
 */
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;

function ensureApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) {
    if (import.meta.env.DEV) {
      console.warn(
        '[firebase] Skipping initialization: environment variables are not set. ' +
          'Copy .env.example to .env.local and fill in your Firebase project config.',
      );
    }
    return null;
  }

  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseApp(): FirebaseApp | null {
  return ensureApp();
}

export function getFirebaseAuth(): Auth | null {
  const instance = ensureApp();
  if (!instance) return null;
  if (!auth) auth = getAuth(instance);
  return auth;
}

export function getFirebaseFirestore(): Firestore | null {
  const instance = ensureApp();
  if (!instance) return null;
  if (!firestore) firestore = getFirestore(instance);
  return firestore;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const instance = ensureApp();
  if (!instance) return null;
  if (!storage) storage = getStorage(instance);
  return storage;
}
