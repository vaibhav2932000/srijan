'use client';

import { useEffect, useRef, useState } from 'react';

interface MobileVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function MobileVideo({ src, poster, className = '' }: MobileVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Load video when it comes into view
            if (video.readyState === 0) {
              video.load();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView) return;

    // Handle video loading
    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      console.warn(`Failed to load video: ${src}`);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [isInView, src]);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={isInView ? src : undefined}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}


