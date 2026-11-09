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
  "/combat-bot-wireframe.webp",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80&fm=webp",
  "/tracked-bot-clean.webp",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80&fm=webp",
  "/tracked-bot-wireframe.webp",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=900&q=80&fm=webp",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=80&fm=webp",
];

// Background Web Worker image cache to decode off the main UI thread
let imageWorker: Worker | null = null;
const workerCallbacks = new Map<string, (url: string) => void>();

function getImageWorker(): Worker | null {
  if (typeof window === "undefined") return null;
  if (!imageWorker && typeof Worker !== "undefined") {
    try {
      imageWorker = new Worker("/image-worker.js");
      imageWorker.onmessage = (e: MessageEvent) => {
        const { src, objectUrl } = e.data;
        const cb = workerCallbacks.get(src);
        if (cb) {
          cb(objectUrl);
          workerCallbacks.delete(src);
        }
      };
    } catch {
      imageWorker = null;
    }
  }
  return imageWorker;
}

function useWorkerDecodedImage(src: string): string {
  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    if (src.startsWith("/")) {
      setResolvedSrc(src);
      return;
    }

    const worker = getImageWorker();
    if (!worker) {
      setResolvedSrc(src);
      return;
    }

    workerCallbacks.set(src, (url: string) => {
      setResolvedSrc(url);
    });

    worker.postMessage({ id: src, src });
  }, [src]);

  return resolvedSrc;
}

interface ImageCardProps {
  src: string;
  onLoad?: () => void;
}

const ImageCard = ({ src, onLoad }: ImageCardProps) => {
  const decodedSrc = useWorkerDecodedImage(src);

  return (
    <HoloCard className="w-full h-[200px] sm:h-[300px] md:h-[400px] flex-shrink-0 cursor-pointer">
      <img
        src={decodedSrc}
        alt="Robolution Mechatronics Asset"
        loading="lazy"
        decoding="async"
        fetchPriority="low"
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
  const loadedCountRef = useRef(0);

  const handleItemLoad = useCallback(() => {
    loadedCountRef.current += 1;
    if (!isReady && loadedCountRef.current >= 1) setIsReady(true);
  }, [isReady]);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(t);
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

  // LINKED SCROLL: In embedded mode, track window scroll relative to containerRef;
  // In standalone mode, track scrollWrapperRef container.
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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.2,
  });

  // Banner animations
  const bannerWidth = useTransform(smoothProgress, [0, 0.15], ["90vw", "100vw"]);
  const bannerHeight = useTransform(smoothProgress, [0, 0.15], ["80vh", "100vh"]);
  const bannerRadius = useTransform(smoothProgress, [0, 0.15], ["48px", "0px"]);
  const bannerBorderWidth = useTransform(smoothProgress, [0, 0.15], ["4px", "0px"]);

  // 3D Matrix animations
  const rotateY = useTransform(smoothProgress, [0.15, 1], [-45, -8]);
  const rotateX = useTransform(smoothProgress, [0.15, 1], [25, 4]);
  const rotateZ = useTransform(smoothProgress, [0.15, 1], [15, 2]);
  const translateZ = useTransform(smoothProgress, [0.15, 1], [-800, 0]);

  // Track columns parallax animations
  const yCol1 = useTransform(smoothProgress, [0.15, 1], ["0%", "-40%"]);
  const yCol2 = useTransform(smoothProgress, [0.15, 1], ["-40%", "10%"]);
  const yCol3 = useTransform(smoothProgress, [0.15, 1], ["0%", "-40%"]);
  const yCol4 = useTransform(smoothProgress, [0.15, 1], ["-30%", "20%"]);

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
        <div className="sticky top-0 h-screen w-full flex justify-center items-center overflow-hidden">
          <motion.div
            style={{
              width: bannerWidth,
              height: bannerHeight,
              borderRadius: bannerRadius,
              borderWidth: bannerBorderWidth,
              borderColor: "#2c2738",
            }}
            className="relative bg-black/85 backdrop-blur-sm overflow-hidden flex items-center justify-center max-w-[1920px] mx-auto will-change-transform backface-hidden preserve-3d"
          >
            <div
              className="absolute inset-0 flex justify-center items-center pointer-events-none"
              style={{ perspective: "1000px" }}
            >
              {/* Ambient Shadow Box Masking */}
              <div className="absolute inset-0 z-20 shadow-[inset_0_100px_150px_-50px_rgba(0,0,0,1),inset_0_-100px_150px_-50px_rgba(0,0,0,1)] pointer-events-none" />
              <div className="absolute inset-0 z-20 shadow-[inset_150px_0_150px_-50px_rgba(0,0,0,1),inset_-150px_0_150px_-50px_rgba(0,0,0,1)] pointer-events-none" />

              {/* Parallax Image Grid Matrix */}
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
                    <ImageCard key={`col1-${index}`} src={src} onLoad={handleItemLoad} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol2 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                  {colMedia.col2.map((src, index) => (
                    <ImageCard key={`col2-${index}`} src={src} onLoad={handleItemLoad} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol3 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                  {colMedia.col3.map((src, index) => (
                    <ImageCard key={`col3-${index}`} src={src} onLoad={handleItemLoad} />
                  ))}
                </motion.div>

                <motion.div style={{ y: yCol4 }} className="flex flex-col gap-4 md:gap-6 w-[22vw] min-w-[200px] pointer-events-auto">
                  {colMedia.col4.map((src, index) => (
                    <ImageCard key={`col4-${index}`} src={src} onLoad={handleItemLoad} />
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
