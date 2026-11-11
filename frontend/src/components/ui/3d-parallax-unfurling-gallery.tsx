"use client";

import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ROBOTICS_GALLERY_IMAGES = [
  "/combat-bot-wireframe.webp",
  "/gallery/ROBOCON 2015.jpg",
  "/gallery/Robocon 2016 (Arena).jpeg",
  "/timeline/robocon-2016-bot-black.jpg",
  "/gallery/ROBOSAGA 2024 (HEXAPOD).jpg",
  "/gallery/HOWERBOARD.jpg",
  "/gallery/HEXACOPTER.jpg",
  "/rover-wireframe.png",
  "/gallery/BOT.jpeg",
  "/tracked-bot-wireframe.webp",
  "/gallery/DROIDTROPPER.jpg",
  "/tracked-bot-clean.webp",
  "/gallery/BOTS USING OWN PCBS.jpg",
  "/gallery/ROBOSAGA 2024.jpg",
  "/gallery/SELF BALANCING BOT.jpg",
  "/gallery/ROBOWARS 2025 IITB TECHFEST.jpg",
];

interface ImageCardProps {
  src: string;
}

const ImageCard = React.memo(({ src }: ImageCardProps) => {
  return (
    <div className="group relative w-full h-[220px] sm:h-[300px] md:h-[380px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10 hover:border-sky-400/50 bg-[#040814]/90 transition-all duration-300 hover:scale-[1.02] shadow-lg">
      {/* Precision telemetry corner ticks */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-sky-400/40 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-sky-400/40 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-sky-400/40 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-sky-400/40 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Subtle telemetry overlay vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-sky-400/[0.04] opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none z-10" />

      <img
        src={encodeURI(src)}
        alt="Robolution Mechatronics Asset"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300 rounded-[11px]"
      />
    </div>
  );
});
ImageCard.displayName = "ImageCard";

export interface UnfurlingGalleryProps {
  images?: string[];
  embedded?: boolean;
  className?: string;
}

export default function Component({
  images = ROBOTICS_GALLERY_IMAGES,
  embedded = false,
  className = "",
}: UnfurlingGalleryProps) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colMedia = useMemo(() => {
    const pool = images && images.length > 0 ? images : ROBOTICS_GALLERY_IMAGES;
    const col1Base = pool.filter((_, i) => i % 4 === 0);
    const col2Base = pool.filter((_, i) => i % 4 === 1);
    const col3Base = pool.filter((_, i) => i % 4 === 2);
    const col4Base = pool.filter((_, i) => i % 4 === 3);

    return {
      col1: [...col1Base, ...col1Base],
      col2: [...col2Base, ...col2Base],
      col3: [...col3Base, ...col3Base],
      col4: [...col4Base, ...col4Base],
    };
  }, [images]);

  // Track window scroll relative to containerRef (smoothly handled by Lenis)
  const { scrollYProgress } = useScroll(
    embedded
      ? {
          target: containerRef,
          offset: ["start start", "end end"],
        }
      : {
          target: containerRef,
          container: scrollWrapperRef,
          offset: ["start start", "end end"],
        }
  );

  // Fast GPU compositor transforms (scale & opacity) - zero layout reflow!
  const bannerScale = useTransform(scrollYProgress, [0, 0.15], [0.94, 1]);
  const bannerOpacity = useTransform(scrollYProgress, [0, 0.08], [0.5, 1]);

  // 3D Matrix animations directly linked to scroll - no double spring delay
  const rotateY = useTransform(scrollYProgress, [0.12, 1], [-45, -8]);
  const rotateX = useTransform(scrollYProgress, [0.12, 1], [25, 4]);
  const rotateZ = useTransform(scrollYProgress, [0.12, 1], [15, 2]);
  const translateZ = useTransform(scrollYProgress, [0.12, 1], [-700, 0]);

  // Track columns parallax animations
  const yCol1 = useTransform(scrollYProgress, [0.12, 1], ["0%", "-40%"]);
  const yCol2 = useTransform(scrollYProgress, [0.12, 1], ["-40%", "10%"]);
  const yCol3 = useTransform(scrollYProgress, [0.12, 1], ["0%", "-40%"]);
  const yCol4 = useTransform(scrollYProgress, [0.12, 1], ["-30%", "20%"]);

  const wrapperClasses = embedded
    ? `relative w-full ${className}`
    : `w-full h-screen overflow-y-auto overflow-x-hidden bg-[#050505] ${className}`;

  return (
    <div 
      ref={scrollWrapperRef}
      className={wrapperClasses}
    >
      <section
        ref={containerRef}
        className={`relative w-full ${
          embedded ? "h-[250vh] sm:h-[300vh]" : "h-[600vh]"
        } bg-transparent text-white font-sans selection:bg-white selection:text-black`}
      >
        <div className="sticky top-0 h-screen w-full flex justify-center items-center overflow-hidden p-2 sm:p-4">
          <motion.div
            style={{
              scale: bannerScale,
              opacity: bannerOpacity,
            }}
            className="relative w-full h-[88vh] sm:h-[94vh] max-w-[1920px] mx-auto bg-[#04060c] rounded-2xl sm:rounded-3xl border border-sky-400/20 overflow-hidden flex items-center justify-center will-change-transform backface-hidden"
          >
            <div
              className="absolute inset-0 flex justify-center items-center pointer-events-none"
              style={{ perspective: "1000px" }}
            >
              {/* Subtle Edge Masking Shadows */}
              <div className="absolute inset-0 z-20 shadow-[inset_0_80px_100px_-40px_rgba(0,0,0,0.9),inset_0_-80px_100px_-40px_rgba(0,0,0,0.9)] pointer-events-none" />
              <div className="absolute inset-0 z-20 shadow-[inset_100px_0_100px_-40px_rgba(0,0,0,0.9),inset_-100px_0_100px_-40px_rgba(0,0,0,0.9)] pointer-events-none" />

              {/* 3D Parallax Image Matrix */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  rotateZ,
                  z: translateZ,
                  transformStyle: "preserve-3d",
                }}
                className="flex gap-3 md:gap-6 justify-center items-center w-[98vw] md:w-[120vw] h-[120vh] md:h-[150vh] origin-center opacity-100 will-change-transform backface-hidden"
              >
                <motion.div style={{ y: yCol1 }} className="flex flex-col gap-3 md:gap-6 w-[44vw] md:w-[22vw] min-w-[140px] md:min-w-[200px] pointer-events-auto">
                  {colMedia.col1.map((src, index) => (
                    <ImageCard key={`col1-${index}`} src={src} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol2 }} className="flex flex-col gap-3 md:gap-6 w-[44vw] md:w-[22vw] min-w-[140px] md:min-w-[200px] pointer-events-auto">
                  {colMedia.col2.map((src, index) => (
                    <ImageCard key={`col2-${index}`} src={src} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol3 }} className="hidden md:flex flex-col gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                  {colMedia.col3.map((src, index) => (
                    <ImageCard key={`col3-${index}`} src={src} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol4 }} className="hidden md:flex flex-col gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                  {colMedia.col4.map((src, index) => (
                    <ImageCard key={`col4-${index}`} src={src} />
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
