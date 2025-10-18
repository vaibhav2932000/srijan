import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Always try to initialize Firebase, even with missing env vars
let app: any = null;
let firebaseAuth: any = null;
let firebaseDb: any = null;

try {
  // Check if we have the required environment variables
  const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                           process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
                           process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (hasFirebaseConfig) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Avoid re-initializing during hot reloads
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);
    firebaseDb = getFirestore(app);
    console.log('Firebase initialized successfully');
  } else {
    // Initialize with default config to avoid errors
    const defaultConfig = {
      apiKey: "demo-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo-project.appspot.com",
      messagingSenderId: "123456789",
      appId: "demo-app-id",
    };
    
    app = getApps().length ? getApp() : initializeApp(defaultConfig);
    firebaseAuth = getAuth(app);
    firebaseDb = getFirestore(app);
    console.warn('Firebase initialized with demo config - environment variables missing');
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // Create minimal mock services
  app = null;
  firebaseAuth = null;
  firebaseDb = null;
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


