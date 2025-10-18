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
  // User data management
  saveUserData: (data: any) => Promise<void>;
  loadUserData: () => Promise<any>;
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
              // Load user data (cart, wishlist, etc.) after successful login
              if (typeof window !== 'undefined') {
                import('@/lib/store').then(({ useStore }) => {
                  useStore.getState().loadUserData();
                });
              }
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
              // Load user data for new users
              if (typeof window !== 'undefined') {
                import('@/lib/store').then(({ useStore }) => {
                  useStore.getState().loadUserData();
                });
              }
            }
          } catch (_e) {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        });
      },

      login: async (email: string, password: string) => {
        try {
          // Check for admin credentials first
          if (email === 'vaibhav' && password === 'srijan') {
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
          }

          // Use Firebase for real users
          if (!auth) {
            return { success: false, error: 'Authentication service not available' };
          }

          await signInWithEmailAndPassword(auth, email, password);
          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.message || 'Login failed' };
        }
      },

      loginWithGoogle: async () => {
        try {
          if (!auth) {
            return { success: false, error: 'Authentication service not available. Please check Firebase configuration.' };
          }
          
          console.log('Attempting Google sign-in');
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          console.log('Google sign-in successful:', result.user.email);
          return { success: true };
        } catch (error: any) {
          console.error('Google sign-in error:', error);
          return { success: false, error: error.message || 'Google sign-in failed' };
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          // Use Firebase for real user registration
          if (!auth || !db) {
            return { success: false, error: 'Authentication service not available. Please check Firebase configuration.' };
          }
          
          console.log('Attempting Firebase registration for:', email);
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          console.log('Firebase registration successful');
          
          if (auth.currentUser && name) {
            try { 
              await updateProfile(auth.currentUser, { displayName: name }); 
              console.log('Profile updated successfully');
            } catch (profileError) {
              console.warn('Profile update failed:', profileError);
            }
          }
          
          const newUser: User = {
            id: cred.user.uid,
            email: cred.user.email || email,
            name,
            role: 'customer',
            createdAt: new Date().toISOString(),
          };
          
          console.log('Saving user to Firestore:', newUser);
          await setDoc(doc(db, 'users', cred.user.uid), newUser, { merge: true });
          console.log('User saved to Firestore successfully');
          
          return { success: true };
        } catch (error: any) {
          console.error('Registration error:', error);
          return { success: false, error: error.message || 'Signup failed' };
        }
      },

      logout: async () => {
        if (auth) {
          await signOut(auth);
        }
        set({ user: null, isAuthenticated: false });
      },

      saveUserData: async (data: any) => {
        const { user } = get();
        if (!user || !db) return;
        
        try {
          await setDoc(doc(db, 'userData', user.id), {
            ...data,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        } catch (error) {
          console.error('Failed to save user data:', error);
        }
      },

      loadUserData: async () => {
        const { user } = get();
        if (!user || !db) return null;
        
        try {
          const userDataDoc = await getDoc(doc(db, 'userData', user.id));
          return userDataDoc.exists() ? userDataDoc.data() : null;
        } catch (error) {
          console.error('Failed to load user data:', error);
          return null;
        }
      },
    }),
    {
      name: 'srijan-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

