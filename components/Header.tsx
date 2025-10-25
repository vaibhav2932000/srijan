'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { SearchIcon, HeartIcon, BagIcon, UserIcon } from './icons/SwadeshiIcons';
import { NAVIGATION_CATEGORIES } from '@/lib/constants';
import { debounce } from '@/lib/utils';
import { useStore } from '@/lib/store';
import SearchModal from './SearchModal';
import MegaNav from './MegaNav';
import CartModal from './CartModal';
import { useAuthStore } from '@/lib/auth-store';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (slug: string) => {
    return pathname.includes(`/category/${slug}`) || pathname === `/${slug}`;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-[9999] transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F5F2EC]/95 backdrop-blur-md shadow-lg border-b border-metal-gold/20'
            : 'bg-[#F5F2EC] border-b border-metal-gold/10'
        }`}
      >
        {/* Main Header */}
        <div className="container-custom">
          <div className="relative flex items-center justify-between h-16 sm:h-20">
            {/* Left group: MegaNav (desktop) */}
            <div className="hidden lg:flex items-center gap-8">
              <MegaNav
                categories={[
                  { 
                    label: 'Clothing', 
                    href: '/products?category=clothing', 
                    items: [
                      { label: '2 Piece Dress Set', href: '/products?category=clothing&subcategory=2-piece-dress-set' },
                      { label: '3 Piece Dress Set', href: '/products?category=clothing&subcategory=3-piece-dress-set' },
                      { label: 'Aawari Short Kurti', href: '/products?category=clothing&subcategory=aawari-short-kurti' },
                      { label: 'Aawari Kurti Collection', href: '/products?category=clothing&subcategory=aawari-kurti-collection' },
                      { label: 'Bagru Print Kurti', href: '/products?category=clothing&subcategory=bagru-print-kurti' },
                      { label: 'Bagru Print Bedsheet Set', href: '/products?category=clothing&subcategory=bagru-print-bedsheet-set' },
                      { label: 'Cord Set (Top & Bottom)', href: '/products?category=clothing&subcategory=cord-set-top-bottom' },
                      { label: 'Crop Top for Women', href: '/products?category=clothing&subcategory=crop-top-women' },
                      { label: 'Gopi Geet Sarees', href: '/products?category=clothing&subcategory=gopi-geet-sarees' },
                      { label: 'Anarkali', href: '/products?category=clothing&subcategory=anarkali' },
                      { label: 'Kaftan', href: '/products?category=clothing&subcategory=kaftan' },
                      { label: 'Gopigeet Kurti Collection', href: '/products?category=clothing&subcategory=gopigeet-kurti' },
                      { label: 'KB Fabrizo Designer Kurti', href: '/products?category=clothing&subcategory=kb-fabrizo-kurti' },
                      { label: 'Livewear Series Kurti', href: '/products?category=clothing&subcategory=livewear-series' },
                      { label: 'New Kaftan Collection', href: '/products?category=clothing&subcategory=kaftan-collection' },
                      { label: 'NKB Kurti Collection', href: '/products?category=clothing&subcategory=nkb-kurti' },
                      { label: 'One Piece Dress', href: '/products?category=clothing&subcategory=one-piece-dress' },
                      { label: 'Piyuji Lehenga Set', href: '/products?category=clothing&subcategory=piyuji-lehenga' },
                      { label: 'Tank Top for Women', href: '/products?category=clothing&subcategory=tank-top' },
                      { label: 'Tie-Dye Kurti Collection', href: '/products?category=clothing&subcategory=tie-dye-kurti' },
                    ]
                  },
                  { 
                    label: 'Handicrafts', 
                    href: '/products?category=handicrafts', 
                    items: [
                      { label: '5 Piece Wall Painting', href: '/products?category=handicrafts&subcategory=5-piece-wall-painting' },
                      { label: 'Pichwai Round Wall Hanging', href: '/products?category=handicrafts&subcategory=pichwai-round-wall-hanging' },
                      { label: 'Tea Coaster', href: '/products?category=handicrafts&subcategory=tea-coaster' },
                    ]
                  },
                  { label: 'Jewelry', href: '/products?category=jewelry', items: [] },
                  { label: 'Bedsheets', href: '/products?category=bedsheets', items: [] },
                ]}
              />
            </div>

            {/* Centered Brand Text - Absolutely positioned */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center group" aria-label="SRIJAN Home">
              <span className="font-cormorant font-bold text-terracotta-deep text-3xl sm:text-5xl tracking-wide heading-underline relative overflow-hidden group-hover:scale-105 transition-all duration-500 ease-out">
                <span className="inline-block animate-pulse-slow bg-gradient-to-r from-terracotta-deep via-metal-gold to-terracotta-deep bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
                  SRIJAN
                </span>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-metal-gold/20 via-terracotta-deep/10 to-metal-gold/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg text-terracotta-deep hover:text-metal-gold hover:bg-metal-gold/10 transition-colors focus-visible-ring"
                aria-label="Search products"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden md:flex p-2 rounded-lg text-terracotta-deep hover:text-metal-gold hover:bg-metal-gold/10 transition-colors focus-visible-ring relative"
                aria-label="Wishlist"
              >
                <HeartIcon className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-metal-gold text-white text-xs rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-lg text-terracotta-deep hover:text-metal-gold hover:bg-metal-gold/10 transition-colors focus-visible-ring relative"
                aria-label="Shopping cart"
              >
                <BagIcon className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-metal-gold text-white text-xs rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={user.avatar || '/placeholder-avatar.jpg'} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-terracotta-deep">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Link
                      href="/account"
                      className="p-2 rounded-lg text-terracotta-deep hover:text-metal-gold hover:bg-metal-gold/10 transition-colors focus-visible-ring"
                      aria-label="Account"
                    >
                      <UserIcon className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg text-terracotta-deep hover:text-metal-gold hover:bg-metal-gold/10 transition-colors focus-visible-ring"
                      aria-label="Logout"
                    >
                      <FiLogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex p-2 rounded-lg text-terracotta-deep hover:text-metal-gold hover:bg-metal-gold/10 transition-colors focus-visible-ring"
                  aria-label="Login"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              {/* Admin Link removed */}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-terracotta-deep hover:text-metal-gold transition-colors focus-visible-ring rounded-lg"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-[9997]"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-metal-gold/20 bg-[#F5F2EC] animate-slide-down relative z-[9998]">
            <nav className="container-custom py-4 space-y-1">
              {NAVIGATION_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={category.slug === 'all' ? '/products' : `/category/${category.slug}`}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    isActive(category.slug)
                      ? 'bg-metal-gold/20 text-terracotta-deep font-medium'
                      : 'text-terracotta-deep hover:bg-metal-gold/10'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
                <div className="pt-2 mt-2 border-t border-metal-gold/20">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 px-4 py-3">
                        <img 
                          src={user.avatar || '/placeholder-avatar.jpg'} 
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-terracotta-deep">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center space-x-2 px-4 py-3 rounded-lg text-terracotta-deep hover:bg-metal-gold/10 transition-colors"
                      >
                        <UserIcon className="w-5 h-5" />
                        <span>Account</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-3 rounded-lg text-terracotta-deep hover:bg-metal-gold/10 transition-colors w-full text-left"
                      >
                        <FiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg text-terracotta-deep hover:bg-metal-gold/10 transition-colors"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Cart Modal */}
      <CartModal open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

