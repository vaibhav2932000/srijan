import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app: App | null = null;

// Only initialize Firebase Admin if we have the required environment variables
if (!getApps().length && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = initializeApp({
      credential: cert({
        projectId: svc.project_id,
        clientEmail: svc.client_email,
        privateKey: svc.private_key?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
    app = null;
  }
} else if (getApps().length > 0) {
  app = getApps()[0]!;
}

// Create a mock Firestore instance for build time
const mockFirestore = {
  collection: () => ({
    doc: () => ({
      set: () => Promise.resolve(),
      get: () => Promise.resolve({ exists: false }),
      update: () => Promise.resolve(),
    }),
    orderBy: () => ({
      get: () => Promise.resolve({ docs: [] }),
    }),
  }),
};

export const adminDb = app ? getFirestore(app) : mockFirestore as any;


