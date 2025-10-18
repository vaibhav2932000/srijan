'use client';

export default function Loader() {
  return (
    <div className="w-10 h-10 animate-spin-slow text-metal-gold" aria-label="Loading">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" strokeDasharray="10 8" />
        <path d="M12 3a9 9 0 009 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}


