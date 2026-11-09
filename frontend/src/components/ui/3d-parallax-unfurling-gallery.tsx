"use client";

import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import HoloCard from "@/components/HoloCard";

const ROBOTICS_GALLERY_IMAGES = [
  "/gallery/BOT.jpeg",
  "/gallery/BOTS FOR ROBORACE.jpg",
  "/gallery/BOTS USING OWN PCBS.jpg",
  "/gallery/DROIDTROPPER.jpg",
  "/gallery/HEXACOPTER.jpg",
  "/gallery/HEXAPOD.jpg",
  "/gallery/HOWERBOARD.jpg",
  "/gallery/LINE FOLLOWER BOT.jpg",
  "/gallery/ROBOCON 2015.jpg",
  "/gallery/ROBOSAGA 2024.jpg",
  "/gallery/SELF BALANCING BOT.jpg",
  "/gallery/GateWay To Robotics Workshop 2026.jpg",
  "/timeline/robowars-2025.jpg",
  "/timeline/robocon-2026-cad-black.jpg",
  "/combat-bot-wireframe.webp",
  "/tracked-bot-clean.webp",
];

interface ImageCardProps {
  src: string;
  onLoad?: () => void;
}

const ImageCard = ({ src, onLoad }: ImageCardProps) => {
  return (
    <HoloCard className="w-full h-[200px] sm:h-[300px] md:h-[400px] flex-shrink-0 cursor-pointer">
      <img
        src={encodeURI(src)}
        alt="Robolution Mechatronics Asset"
        loading="lazy"
        decoding="async"
        onLoad={onLoad}
        className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-300 rounded-[15px]"
      />
    </HoloCard>
  );
};

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const [imagesLoaded, setImagesLoaded] = useState(0);

  const handleImageLoad = useCallback(() => {
    setImagesLoaded((prev) => prev + 1);
  }, []);

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

  const { scrollYProgress } = useScroll({
    target: scrollWrapperRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  const rollAngle = useTransform(smoothProgress, [0, 0.45], [-90, 0]);
  const rollScale = useTransform(smoothProgress, [0, 0.45], [0.35, 1]);
  const rollOpacity = useTransform(smoothProgress, [0, 0.2], [0, 1]);

  const col1Y = useTransform(smoothProgress, [0.3, 1], ["0%", "-40%"]);
  const col2Y = useTransform(smoothProgress, [0.3, 1], ["0%", "30%"]);
  const col3Y = useTransform(smoothProgress, [0.3, 1], ["0%", "-35%"]);
  const col4Y = useTransform(smoothProgress, [0.3, 1], ["0%", "25%"]);

  return (
    <div
      ref={scrollWrapperRef}
      className={`relative w-full h-[240vh] sm:h-[280vh] ${className}`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div
          ref={containerRef}
          style={{
            rotateX: rollAngle,
            scale: rollScale,
            opacity: rollOpacity,
            transformPerspective: 1200,
          }}
          className="relative w-full max-w-7xl h-full flex items-center justify-center px-4 sm:px-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full h-[120vh] -my-[10vh]">
            <motion.div style={{ y: col1Y }} className="flex flex-col gap-4">
              {colMedia.col1.map((src, i) => (
                <ImageCard key={`c1-${i}`} src={src} onLoad={handleImageLoad} />
              ))}
            </motion.div>

            <motion.div style={{ y: col2Y }} className="flex flex-col gap-4">
              {colMedia.col2.map((src, i) => (
                <ImageCard key={`c2-${i}`} src={src} onLoad={handleImageLoad} />
              ))}
            </motion.div>

            <motion.div style={{ y: col3Y }} className="flex flex-col gap-4">
              {colMedia.col3.map((src, i) => (
                <ImageCard key={`c3-${i}`} src={src} onLoad={handleImageLoad} />
              ))}
            </motion.div>

            <motion.div style={{ y: col4Y }} className="flex flex-col gap-4">
              {colMedia.col4.map((src, i) => (
                <ImageCard key={`c4-${i}`} src={src} onLoad={handleImageLoad} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
