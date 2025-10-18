'use client';
import Image from 'next/image';
import Link from 'next/link';

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  image: string;
  videoSrc?: string;
  hideContent?: boolean;
}

export default function Hero({ title, subtitle, ctaPrimary, ctaSecondary, image, videoSrc, hideContent = false }: HeroProps) {
  return (
    <section className="relative min-h-[560px] lg:min-h-[640px] overflow-hidden bg-neutral-50">
      {/* Media */}
      <div className="absolute inset-0">
        {videoSrc ? (
          <video
            className="w-full h-full object-cover"
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            poster={image}
            preload="auto"
          />
        ) : (
          <Image src={image} alt="Hero" fill className="object-cover" priority />
        )}
        {!hideContent && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        )}
      </div>

      {/* Content */}
      {!hideContent && (
        <div className="relative z-10">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-2xl">
              <h1 className="text-[40px] leading-tight sm:text-[56px] lg:text-[64px] font-bold text-white">{title}</h1>
              {subtitle && <p className="mt-4 text-lg text-white/90">{subtitle}</p>}

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={ctaPrimary.href} className="btn-primary">
                  {ctaPrimary.label}
                </Link>
                {ctaSecondary && (
                  <Link href={ctaSecondary.href} className="btn-outline">
                    {ctaSecondary.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


