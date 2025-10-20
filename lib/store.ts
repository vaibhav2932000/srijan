import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuthStore } from './auth-store';
import type { CartItem, WishlistItem } from '@/types';

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, selectedSize: string | undefined, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Firebase sync helpers
  syncCartToCloud: () => Promise<void>;
  syncWishlistToCloud: () => Promise<void>;
  loadUserData: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      
      addToCart: (item) => {
        set((state) => {
          const existing = state.cart.find(
            (i) => i.product.id === item.product.id && i.selectedSize === item.selectedSize
          );
          
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.product.id === item.product.id && i.selectedSize === item.selectedSize
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          
          return { cart: [...state.cart, item] };
        });
        get().syncCartToCloud().catch(() => void 0);
      },
      
      removeFromCart: (productId, selectedSize) => {
        set((state) => ({
          cart: state.cart.filter((item) =>
            selectedSize != null
              ? !(item.product.id === productId && item.selectedSize === selectedSize)
              : item.product.id !== productId
          ),
        }));
        get().syncCartToCloud().catch(() => void 0);
      },
      
      updateQuantity: (productId, selectedSize, quantity) => {
        set((state) => ({
          cart: state.cart
            .map((item) =>
              (selectedSize != null
                ? (item.product.id === productId && item.selectedSize === selectedSize)
                : (item.product.id === productId)
              )
                ? { ...item, quantity: Math.max(0, quantity) }
                : item
            )
            .filter((item) => item.quantity > 0),
        }));
        get().syncCartToCloud().catch(() => void 0);
      },
      
      clearCart: () => {
        set({ cart: [] });
        get().syncCartToCloud().catch(() => void 0);
      },
      
      // Wishlist state
      wishlist: [],
      
      addToWishlist: (productId) => {
        set((state) => {
          if (state.wishlist.some((item) => item.productId === productId)) {
            return state;
          }
          
          return {
            wishlist: [
              ...state.wishlist,
              { productId, addedAt: new Date().toISOString() },
            ],
          };
        });
        get().syncWishlistToCloud().catch(() => void 0);
      },
      
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.productId !== productId),
        }));
        get().syncWishlistToCloud().catch(() => void 0);
      },
      
      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.productId === productId);
      },

      // Firebase sync helpers
      syncCartToCloud: async () => {
        const authState = useAuthStore.getState();
        const user = authState.user;
        if (!user) {
          console.log('No user found, skipping cart sync');
          return;
        }
        try {
          console.log('Syncing cart to Firebase for user:', user.id, 'Cart items:', get().cart.length);
          await setDoc(doc(db, 'users', user.id), { cart: get().cart }, { merge: true });
          console.log('Cart synced successfully');
        } catch (error) {
          console.error('Failed to sync cart to Firebase:', error);
        }
      },

      syncWishlistToCloud: async () => {
        const authState = useAuthStore.getState();
        const user = authState.user;
        if (!user) return;
        try {
          await setDoc(doc(db, 'users', user.id), { wishlist: get().wishlist }, { merge: true });
        } catch (_e) {}
      },

      loadUserData: async () => {
        const authState = useAuthStore.getState();
        const user = authState.user;
        if (!user) return;
        
        const currentState = get();
        console.log('Current cart before loading:', currentState.cart.length);
        
        try {
          console.log('Loading user data for:', user.id);
          const snap = await getDoc(doc(db, 'users', user.id));
          if (snap.exists()) {
            const data = snap.data() as any;
            console.log('User data loaded:', { cart: data.cart?.length || 0, wishlist: data.wishlist?.length || 0 });
            set({
              cart: Array.isArray(data.cart) ? data.cart : [],
              wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
            });
          } else {
            console.log('No user data found, keeping existing cart');
            // Don't clear the cart if no user data is found
            // Just initialize empty wishlist
            set({ wishlist: [] });
          }
        } catch (error) {
          console.error('Failed to load user data:', error);
        }
      },
    }),
    {
      name: 'srijan-store',
    }
  )
);

