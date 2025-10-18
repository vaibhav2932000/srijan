import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiPackage, FiTruck, FiHeart, FiAward } from 'react-icons/fi';
import { useEffect, useRef, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductCarousel from '@/components/ProductCarousel';
import ProductGrid from '@/components/ProductGrid';
import MotifDivider from '@/components/MotifDivider';
import Loader from '@/components/Loader';
import Hero from '@/components/Hero';
import MobileVideo from '@/components/MobileVideo';
import { api } from '@/lib/api';

// Sample featured categories
const FEATURED_CATEGORIES = [
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Traditional & contemporary wear',
    icon: '👘',
    image: '/cat-clothing.jpg',
  },
  {
    name: 'Handicrafts',
    slug: 'handicrafts',
    description: 'Artisan-crafted treasures',
    icon: '🎨',
    image: '/cat-handicrafts.jpg',
  },
  {
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Handmade ornaments',
    icon: '💍',
    image: '/cat-jewelry.jpg',
  },
  {
    name: 'Bedsheets',
    slug: 'bedsheets',
    description: 'Luxury cotton bedsheets',
    icon: '🛏️',
    image: '/cat-bedsheets.jpg',
  },
];

const FEATURES = [
  {
    icon: FiPackage,
    title: 'Handcrafted Quality',
    description: 'Every product is made with love by skilled artisans',
  },
  {
    icon: FiTruck,
    title: 'Free Shipping',
    description: 'On orders above ₹999 across India',
  },
  {
    icon: FiHeart,
    title: 'Sustainable',
    description: 'Eco-friendly and ethically sourced materials',
  },
  {
    icon: FiAward,
    title: 'Authentic',
    description: '100% genuine handmade products',
  },
];

export default async function HomePage() {
  // Fetch featured products (or use sample data if backend not ready)
  let featuredProducts = [];
  let newArrivals = [];

  try {
    const response = await api.getProducts({ tags: ['featured'] }, 1, 4);
    featuredProducts = response.products;
    
    const newResponse = await api.getProducts({ tags: ['new-arrival'] }, 1, 8);
    newArrivals = newResponse.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Use sample data if API fails
    featuredProducts = [];
    newArrivals = [];
  }

  return (
    <div className="animate-fade-in">
      {/* Split media: full-bleed – video left, image center, video right */}
      <section className="relative bg-white">
        <div className="grid grid-cols-3 gap-1 lg:gap-4 w-full">
          {/* Left: Video 1 (touches left edge) */}
          <MobileVideo
            src="/hey.mp4"
            poster="/hero.jpg"
            className="h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[72vh]"
          />

          {/* Center: Video 3 */}
          <MobileVideo
            src="/Video3.mp4"
            poster="/hero.jpg"
            className="h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[72vh]"
          />

          {/* Right: Video 2 (touches right edge) */}
          <MobileVideo
            src="/movie2.mp4"
            poster="/hero.jpg"
            className="h-[35vh] sm:h-[45vh] md:h-[55vh] lg:h-[72vh]"
          />
        </div>
        {/* Primary category CTAs overlay */}
        <div className="absolute inset-x-0 bottom-2 sm:bottom-6 flex justify-center px-1 sm:px-4">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 bg-[#F5F2EC]/90 backdrop-blur-md border border-metal-gold/30 rounded-full px-2 sm:px-4 py-1 sm:py-3 shadow-gold">
            <Link href="/category/clothing" className="btn-primary uppercase tracking-wide px-2 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-base">
              Shop Now — Clothing
            </Link>
            <Link href="/category/handicrafts" className="btn-outline uppercase tracking-wide px-2 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-base">
              Shop Now — Handicrafts
            </Link>
          </div>
        </div>
      </section>
      <MotifDivider />

      {/* Multilingual Headline section below video */}
      <section className="bg-white animate-fade-in">
        <div className="max-w-[1200px] mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-12">
          {/* Main Hindi Highlight */}
          <div className="text-center mb-8">
            <div className="inline-block" style={{fontFamily: 'Kalam, cursive'}}>
              <p className="text-xl sm:text-3xl lg:text-5xl text-terracotta-deep mb-1 sm:mb-3 font-bold leading-tight">गर्व से कहो, यह स्वदेशी है</p>
              <p className="text-base sm:text-xl lg:text-2xl text-black font-medium">हर घर स्वदेशी, घर-घर स्वदेशी।</p>
            </div>
          </div>

          {/* Other Languages Below */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-6 lg:gap-8 py-2 sm:py-6">
            {/* Tamil */}
            <div className="text-center transform -rotate-1" style={{fontFamily: 'Kalam, cursive'}}>
              <p className="text-sm sm:text-lg lg:text-xl text-terracotta-deep mb-1 font-bold">பெருமையுடன் சொல்லுங்கள், இது சுதேசி.</p>
              <p className="text-xs sm:text-sm lg:text-base text-black font-medium">ஒவ்வொரு வீடும் சுதேசி, ஒவ்வொரு வீதிக்கும் சுதேசி.</p>
            </div>

            {/* Telugu */}
            <div className="text-center transform rotate-2" style={{fontFamily: 'Kalam, cursive'}}>
              <p className="text-sm sm:text-lg lg:text-xl text-terracotta-deep mb-1 font-bold">గర్వంగా చెప్పండి, ఇది స్వదేశీ.</p>
              <p className="text-xs sm:text-sm lg:text-base text-black font-medium">ప్రతి ఇల్లు స్వదేశీ, ప్రతి ఇంటికి స్వదేశీ.</p>
            </div>

            {/* English */}
            <div className="text-center transform -rotate-2" style={{fontFamily: 'Dancing Script, cursive'}}>
              <p className="text-sm sm:text-lg lg:text-xl text-terracotta-deep mb-1 font-bold">Say with pride, this is Swadeshi.</p>
              <p className="text-xs sm:text-sm lg:text-base text-black font-medium">Every home Swadeshi, every house Swadeshi.</p>
            </div>

            {/* Kannada */}
            <div className="text-center transform rotate-1" style={{fontFamily: 'Kalam, cursive'}}>
              <p className="text-sm sm:text-lg lg:text-xl text-terracotta-deep mb-1 font-bold">ಹೆಮ್ಮೆಯಿಂದ ಹೇಳಿ, ಇದು ಸ್ವದೇಶಿ.</p>
              <p className="text-xs sm:text-sm lg:text-base text-black font-medium">ಪ್ರತಿ ಮನೆ ಸ್ವದೇಶಿ, ಮನೆಮನೆಗೂ ಸ್ವದೇಶಿ.</p>
            </div>

            {/* Mahatma Gandhi Quote */}
            <div className="text-center transform -rotate-1" style={{fontFamily: 'Dancing Script, cursive'}}>
              <p className="text-sm sm:text-base lg:text-lg text-terracotta-deep mb-1 font-bold italic">"There is no salvation for us without true Swadeshi"</p>
              <p className="text-xs sm:text-sm lg:text-base text-black font-medium">— Mahatma Gandhi</p>
            </div>
          </div>
        </div>
      </section>
      <MotifDivider />

      {/* Explore Our Collections Section */}
      <section className="bg-[#F5F2EC] animate-fade-in">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="text-center mb-8">
            <h2 className="text-4xl lg:text-5xl font-cormorant font-bold text-terracotta-deep mb-4 heading-underline inline-block">
              Explore Our Collections
            </h2>
            <p className="text-lg lg:text-xl text-charcoal-text max-w-3xl mx-auto font-hind">
              From traditional handicrafts to contemporary clothing, discover the rich heritage of Indian artistry.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
            {/* Handicrafts */}
            <Link
              href="/category/handicrafts"
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MobileVideo
                src="/handicraft.mp4"
                poster="/hero.jpg"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20 flex items-end">
                <div className="p-3 sm:p-6 text-center w-full">
                  <h3 className="text-sm sm:text-2xl font-cormorant font-bold text-white mb-1 sm:mb-2">Handicrafts</h3>
                  <p className="text-white/90 font-hind text-xs sm:text-sm mb-1 sm:mb-4">Artisan-crafted treasures</p>
                  <span className="inline-flex items-center text-sm font-hind font-medium text-metal-gold group-hover:text-white transition-colors">
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>

            {/* Clothing */}
            <Link
              href="/category/clothing"
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MobileVideo
                src="/Clothing.mp4"
                poster="/hero.jpg"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20 flex items-end">
                <div className="p-3 sm:p-6 text-center w-full">
                  <h3 className="text-sm sm:text-2xl font-cormorant font-bold text-white mb-1 sm:mb-2">Clothing</h3>
                  <p className="text-white/90 font-hind text-xs sm:text-sm mb-1 sm:mb-4">Traditional & contemporary wear</p>
                  <span className="inline-flex items-center text-sm font-hind font-medium text-metal-gold group-hover:text-white transition-colors">
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>

            {/* Jewelry */}
            <Link
              href="/category/jewelry"
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MobileVideo
                src="/jewelery.mp4"
                poster="/hero.jpg"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20 flex items-end">
                <div className="p-3 sm:p-6 text-center w-full">
                  <h3 className="text-sm sm:text-2xl font-cormorant font-bold text-white mb-1 sm:mb-2">Jewelry</h3>
                  <p className="text-white/90 font-hind text-xs sm:text-sm mb-1 sm:mb-4">Handmade ornaments</p>
                  <span className="inline-flex items-center text-sm font-hind font-medium text-metal-gold group-hover:text-white transition-colors">
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>

            {/* Bedsheets */}
            <Link
              href="/category/bedsheets"
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MobileVideo
                src="/bedsheet.mp4"
                poster="/hero.jpg"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-black/20 flex items-end">
                <div className="p-3 sm:p-6 text-center w-full">
                  <h3 className="text-sm sm:text-2xl font-cormorant font-bold text-white mb-1 sm:mb-2">Bedsheets</h3>
                  <p className="text-white/90 font-hind text-xs sm:text-sm mb-1 sm:mb-4">Luxury cotton bedsheets</p>
                  <span className="inline-flex items-center text-sm font-hind font-medium text-metal-gold group-hover:text-white transition-colors">
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <MotifDivider />

      {/* Features Section */}
      <section className="bg-white animate-fade-in">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Handcrafted Quality */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-metal-gold/20 text-terracotta-deep mb-4 sm:mb-6 group-hover:bg-metal-gold/30 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-cormorant font-semibold text-terracotta-deep mb-2 sm:mb-3">Handcrafted Quality</h3>
              <p className="text-charcoal-text font-hind text-xs sm:text-sm leading-relaxed">Every product is made with love by skilled artisans</p>
            </div>

            {/* Free Shipping */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta-deep/20 text-terracotta-deep mb-6 group-hover:bg-terracotta-deep/30 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-cormorant font-semibold text-terracotta-deep mb-2 sm:mb-3">Free Shipping</h3>
              <p className="text-charcoal-text font-hind text-xs sm:text-sm leading-relaxed">On orders above ₹999 across India</p>
            </div>

            {/* Sustainable */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-deep/20 text-indigo-deep mb-6 group-hover:bg-indigo-deep/30 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-cormorant font-semibold text-terracotta-deep mb-2 sm:mb-3">Sustainable</h3>
              <p className="text-charcoal-text font-hind text-xs sm:text-sm leading-relaxed">Eco-friendly and ethically sourced materials</p>
            </div>

            {/* Authentic */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-metal-gold/20 text-metal-gold mb-6 group-hover:bg-metal-gold/30 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-cormorant font-semibold text-terracotta-deep mb-2 sm:mb-3">Authentic</h3>
              <p className="text-charcoal-text font-hind text-xs sm:text-sm leading-relaxed">100% genuine handmade products</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

