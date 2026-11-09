"use client";

import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const ROBOTICS_GALLERY_IMAGES = [
  "/gallery/kratos-combat-drum-bot.jpg",
  "/combat-bot-wireframe.webp",
  "/gallery/badminton-robot-chassis.jpg",
  "/gallery/pendulum-tower-robot.jpg",
  "/gallery/robocon-stage-victory.jpg",
  "/gallery/hexacopter-flight-sky.jpg",
  "/gallery/spherical-rib-rover.jpg",
  "/gallery/feeder-mechanism-robot.jpg",
  "/gallery/robosaga-hexapod-spider.jpg",
  "/gallery/robocon-podium-team.jpg",
  "/gallery/robocon-team-night.jpg",
  "/gallery/pneumatic-arena-robot.jpg",
  "/gallery/spiked-tire-all-terrain-rover.jpg",
  "/gallery/electric-balancing-skateboard.jpg",
  "/gallery/drone-telemetry-controller.jpg",
  "/rover-wireframe.png",
  "/gallery/custom-pcb-line-follower.jpg",
  "/tracked-bot-wireframe.webp",
  "/gallery/arduino-bot-chassis.jpg",
  "/tracked-bot-clean.webp",
];

interface ImageCardProps {
  src: string;
}

const ImageCard = React.memo(({ src }: ImageCardProps) => {
  return (
    <div className="group relative w-full h-[220px] sm:h-[300px] md:h-[380px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10 hover:border-sky-400/50 bg-[#040814]/80 transition-all duration-300 hover:scale-[1.02]">
      {/* Precision telemetry corner ticks */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-sky-400/40 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-sky-400/40 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-sky-400/40 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-sky-400/40 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Subtle telemetry overlay vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-sky-400/[0.04] opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none z-10" />

      <img
        src={src}
        alt="Robolution Mechatronics Asset"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
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

  // Group images into 4 distinct non-duplicated columns (5 unique assets per column)
  const colMedia = useMemo(() => {
    const pool = images && images.length > 0 ? images : ROBOTICS_GALLERY_IMAGES;
    return {
      col1: pool.filter((_, i) => i % 4 === 0),
      col2: pool.filter((_, i) => i % 4 === 1),
      col3: pool.filter((_, i) => i % 4 === 2),
      col4: pool.filter((_, i) => i % 4 === 3),
    };
  }, [images]);

  // Track window scroll relative to containerRef
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

  // Calibrated spring physics with restDelta to sleep once idle
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.15,
    restDelta: 0.001,
  });

  // GPU-only scale & opacity unfurl (zero layout-thrashing width/height reflow)
  const bannerScale = useTransform(smoothProgress, [0, 0.15], [0.94, 1]);
  const bannerOpacity = useTransform(smoothProgress, [0, 0.08], [0.75, 1]);

  // Calibrated 3D Matrix animations (compositor transform only)
  const rotateY = useTransform(smoothProgress, [0.15, 1], [-26, -6]);
  const rotateX = useTransform(smoothProgress, [0.15, 1], [18, 3]);
  const rotateZ = useTransform(smoothProgress, [0.15, 1], [10, 1]);
  const translateZ = useTransform(smoothProgress, [0.15, 1], [-500, 0]);

  // Track columns parallax animations (GPU transform y only)
  const yCol1 = useTransform(smoothProgress, [0.15, 1], ["0%", "-28%"]);
  const yCol2 = useTransform(smoothProgress, [0.15, 1], ["-28%", "8%"]);
  const yCol3 = useTransform(smoothProgress, [0.15, 1], ["0%", "-28%"]);
  const yCol4 = useTransform(smoothProgress, [0.15, 1], ["-20%", "14%"]);

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
          embedded ? "h-[240vh] sm:h-[280vh]" : "h-[450vh]"
        } bg-transparent text-white font-sans selection:bg-white selection:text-black`}
      >
        <div className="sticky top-0 h-screen w-full flex justify-center items-center overflow-hidden p-2 sm:p-4">
          <motion.div
            style={{
              scale: bannerScale,
              opacity: bannerOpacity,
            }}
            className="relative w-full h-[88vh] sm:h-[92vh] max-w-[1920px] mx-auto bg-black/85 rounded-2xl sm:rounded-3xl border border-sky-400/20 overflow-hidden flex items-center justify-center will-change-transform backface-hidden"
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
                className="flex gap-4 md:gap-6 justify-center items-center w-[120vw] h-[150vh] origin-center opacity-100 will-change-transform backface-hidden"
              >
                <motion.div style={{ y: yCol1 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                  {colMedia.col1.map((src, index) => (
                    <ImageCard key={`col1-${index}`} src={src} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol2 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                  {colMedia.col2.map((src, index) => (
                    <ImageCard key={`col2-${index}`} src={src} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol3 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                  {colMedia.col3.map((src, index) => (
                    <ImageCard key={`col3-${index}`} src={src} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol4 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
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
