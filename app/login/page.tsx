'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/auth-store';

function LoginPageContent() {
  const router = useRouter();
  const next = useSearchParams().get('next') || '/account';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); 
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setErr(result.error || 'Login failed');
        return;
      }
      // Success popup is handled in auth store
      router.push('/products');
    } catch (error) {
      setErr('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    setErr('');
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setErr(result.error || 'Google sign-in failed');
        return;
      }
      // Success popup is handled in auth store
      router.push('/products');
    } catch (error) {
      setErr('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-16">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        
        {/* Removed demo credentials */}
        
        {err && <div className="text-red-600 mb-4 bg-red-50 border border-red-200 rounded p-3">{err}</div>}
        
        <form onSubmit={onSubmit} className="space-y-4">
          <input 
            className="input w-full" 
            type="text" 
            placeholder="Email or Username" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required 
          />
          <input 
            className="input w-full" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required 
          />
          <button 
            className="btn-primary w-full" 
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <button 
            className="btn-secondary w-full flex items-center justify-center gap-2" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>
          
          <button 
            className="btn-outline w-full" 
            onClick={()=>router.push('/signup')}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-parchment flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}


