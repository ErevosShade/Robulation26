'use client';

import CursorGrid from "@/components/CursorGrid";
import TechText from "@/components/TechText";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none">
      {/* Left Vertical Sidebar (Design from Image 1, Details from Image 2) */}
      <Sidebar />

      {/* Background Monochrome Cursor Grid */}
      <div className="absolute inset-0 z-0">
        <CursorGrid
          cellSize={60}
          color="#ffffff"
          gridOpacity={0.12}
          fillOpacity={0.06}
          radius={180}
          clickPulse={true}
          className="w-full h-full"
        />
      </div>

      {/* Atmospheric Subtle Violet Light Flare from Reference Image */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(88, 28, 135, 0.35) 0%, rgba(59, 7, 100, 0.12) 50%, transparent 80%)",
        }}
      />

      {/* Centered Interactive TechText Matching Exact Font and White-to-Grey Gradient */}
      <div className="relative z-10 w-full max-w-4xl h-[160px] sm:h-[200px] lg:h-[240px] px-4 pointer-events-auto flex items-center justify-center -translate-y-32 sm:-translate-y-40 lg:-translate-y-48">
        <TechText
          text="ROBOLUTION"
          fontFamily="'Arial Black', 'Impact', sans-serif"
          fontWeight={900}
          fontSize={90}
          letterSpacing={-0.03}
          strokeWidth={2.5}
          gradient={true}
          color="#ffffff"
          accentColor="#ffffff"
          className="w-full h-full"
        />
      </div>
    </main>
  );
}
