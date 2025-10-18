import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Check if we have the required environment variables
const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
                         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let app: any = null;
let firebaseAuth: any = null;
let firebaseDb: any = null;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  try {
    // Avoid re-initializing during hot reloads
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);
    firebaseDb = getFirestore(app);
  } catch (error) {
    console.warn('Firebase client initialization failed:', error);
    app = null;
    firebaseAuth = null;
    firebaseDb = null;
  }
} else {
  console.warn('Firebase environment variables not found, using mock services');
}

// Create mock services for build time
const mockAuth = {
  signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
  createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
  signOut: () => Promise.resolve(),
  onAuthStateChanged: () => () => {},
  currentUser: null,
};

const mockDb = {
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

export const auth = firebaseAuth || mockAuth;
export const db = firebaseDb || mockDb;
export default app;


