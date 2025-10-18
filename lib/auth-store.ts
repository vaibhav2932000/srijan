"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initializeAuth: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      initializeAuth: () => {
        if (!auth) {
          console.warn('Firebase auth not initialized');
          set({ isLoading: false });
          return;
        }
        
        onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (!firebaseUser) {
            const current = get();
            // If a manual admin login exists, keep it and just stop loading
            if (current.user && current.user.id === 'admin-fixed' && current.user.role === 'admin') {
              set({ isAuthenticated: true, isLoading: false });
              return;
            }
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }

          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
              const data = userSnap.data() as User;
              
              // Check if user is admin in local file
              try {
                const adminCheck = await fetch('/api/admin/check-admin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: firebaseUser.uid }),
                });
                const adminData = await adminCheck.json();
                if (adminData.isAdmin) {
                  data.role = 'admin';
                }
              } catch (e) {
                // Ignore admin check errors
              }
              
              set({ user: data, isAuthenticated: true, isLoading: false });
            } else {
              const newUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User'),
                avatar: firebaseUser.photoURL || undefined,
                role: 'customer',
                createdAt: new Date().toISOString(),
              };
              await setDoc(userDocRef, newUser);
              set({ user: newUser, isAuthenticated: true, isLoading: false });
            }
          } catch (_e) {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        });
      },

      login: async (email: string, password: string) => {
        try {
          // Use API login for all users (including admin)
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.error || 'Login failed' };
          }
          
          const data = await response.json();
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message || 'Login failed' };
        }
      },

      loginWithGoogle: async () => {
        try {
          if (!auth) {
            return { success: false, error: 'Authentication service not available' };
          }
          
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message || 'Google sign-in failed' };
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          // Use API registration to avoid Firebase recaptcha issues
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
          });
          
          if (!response.ok) {
            const error = await response.json();
            return { success: false, error: error.error || 'Signup failed' };
          }
          
          const data = await response.json();
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message || 'Signup failed' };
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'srijan-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

