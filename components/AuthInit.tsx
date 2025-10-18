'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useStore } from '@/lib/store';

export default function AuthInit() {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const loadUserData = useStore((s) => s.loadUserData as undefined | (() => Promise<void>));

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (typeof loadUserData === 'function') {
      loadUserData().catch(() => void 0);
    }
  }, [loadUserData]);

  return null;
}


