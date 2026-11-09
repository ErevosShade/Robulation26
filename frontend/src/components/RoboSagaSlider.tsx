'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const robosagaImages = [
  {
    src: encodeURI('/gallery/DROIDTROPPER ROBOSAGA\'24.jpg'),
    title: 'DROID TROOPER SHOWCASE',
    caption: 'ARENA OBSTACLE COURSE // ROBOSAGA',
  },
  {
    src: encodeURI('/gallery/DROIDTROPPER TRACK ROBOSAGA .jpg'),
    title: 'OFFICIAL COMPETITION TRACK',
    caption: 'ROBOSAGA FLAGSHIP OBSTACLE GRID',
  },
  {
    src: encodeURI('/gallery/ROBOSAGA 2024.jpg'),
    title: 'ANNUAL FESTIVAL ASSEMBLY',
    caption: 'ROBOSAGA MAIN STAGE & ARENA AUDIENCE',
  },
  {
    src: encodeURI('/gallery/ROBOSAGA 2024 (HEXAPOD).jpg'),
    title: 'HEXAPOD DEMONSTRATION',
    caption: 'INVERSE KINEMATICS SPIDER DISPLAY',
  },
  {
    src: encodeURI('/gallery/ROBOSAGA 2025 SPEAKERSESSION.JPG'),
    title: 'KEYNOTE TECHNICAL SYMPOSIUM',
    caption: 'GOLDEN JUBILEE AUDITORIUM LECTURE',
  },
  {
    src: encodeURI('/gallery/SPEAKER SESSION ROBOSAGA25.JPG'),
    title: 'INDUSTRY PERSPECTIVES',
    caption: 'ADVANCED ROBOTICS KEYNOTE',
  },
];

interface RoboSagaSliderProps {
  className?: string;
}

export default function RoboSagaSlider({ className = '' }: RoboSagaSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % robosagaImages.length);
    }, 3800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative w-full h-[320px] sm:h-[400px] lg:h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl group ${className}`}>
      {robosagaImages.map((img, idx) => (
        <div
          key={img.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={img.src}
            alt={img.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            priority={idx === 0}
          />
          {/* Subtle gradient vignette to blend cleanly with dark theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        </div>
      ))}

      {/* Clean Minimal Progress Dots at Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
        {robosagaImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex ? 'w-4 bg-white' : 'bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Jump to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
