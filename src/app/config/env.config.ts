/**
 * Centralized, typed access to environment configuration.
 *
 * All Vite env vars consumed by the app must be read through this module
 * rather than scattering `import.meta.env.X` throughout the codebase, and
 * must be listed in .env.example. Never put secrets here directly - Vite
 * exposes every VITE_-prefixed variable to client-side code, so this file
 * (like all client env config) is inherently public.
 */

function readEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value && import.meta.env.PROD) {
    // In production we want a loud, early failure rather than a silently
    // misconfigured Firebase client.
    console.error(`Missing required environment variable: ${key}`);
  }
  return value ?? '';
}

export const firebaseConfig = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('VITE_FIREBASE_APP_ID'),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

export const apiConfig = {
  /** Base URL for Firebase Cloud Functions callable/HTTPS endpoints. */
  functionsRegion: readEnv('VITE_FIREBASE_FUNCTIONS_REGION') || 'europe-west1',
};

export const mapsConfig = {
  googleMapsApiKey: readEnv('VITE_GOOGLE_MAPS_API_KEY'),
};

/** Feature flags: keep every flag boolean and default to false so an
 * unset/misconfigured env never silently enables an unfinished feature. */
export const featureFlags = {
  liveMeetings: import.meta.env.VITE_FEATURE_LIVE_MEETINGS === 'true',
  payments: import.meta.env.VITE_FEATURE_PAYMENTS === 'true',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
