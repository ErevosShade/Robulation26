'use client';

import React from 'react';
import CursorGrid from "@/components/CursorGrid";
import TechText from "@/components/TechText";
import Sidebar from "@/components/Sidebar";
import RoverWireframe3D from "@/components/RoverWireframe3D";
import HudBox from "@/components/HudBox";

export default function Home() {
  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden flex flex-col justify-between select-none">
      {/* Left Smooth Trapezoid Glassmorphic Sidebar */}
      <Sidebar />

      {/* Interactive Background Monochrome Cursor Grid */}
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
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none z-0 opacity-35"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(88, 28, 135, 0.35) 0%, rgba(59, 7, 100, 0.12) 50%, transparent 80%)",
        }}
      />

      {/* Top Header: ROBOLUTION (EST banner moved to bottom) */}
      <header className="relative z-20 w-full pt-8 sm:pt-12 flex flex-col items-center pointer-events-none pl-14 sm:pl-0">
        <div className="w-full max-w-3xl h-[58px] sm:h-[72px] px-4 pointer-events-auto flex items-center justify-center">
          <TechText
            text="ROBOLUTION"
            fontFamily="'Arial Black', 'Impact', sans-serif"
            fontWeight={900}
            fontSize={65}
            letterSpacing={-0.03}
            strokeWidth={2}
            gradient={true}
            color="#ffffff"
            accentColor="#ffffff"
            className="w-full h-full"
          />
        </div>
      </header>

      {/* 3D CAD Wireframe Rover Flanked by Sci-Fi HUD Callout Boxes */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center -mt-2 sm:-mt-4 pointer-events-none px-4 pl-14 sm:pl-20">
        {/* Subtle Silver Glow Spotlight in Rover Background */}
        <div
          className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[380px] sm:w-[660px] sm:h-[480px] pointer-events-none z-0 opacity-85"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.30) 0%, rgba(225, 235, 250, 0.15) 35%, rgba(180, 200, 225, 0.04) 62%, transparent 75%)",
            filter: "blur(14px)",
          }}
        />

        {/* Center Container holding Rover & Flanking Desktop HUD Boxes */}
        <div className="relative w-full max-w-[1400px] h-full flex items-center justify-center">
          {/* Left HUD Callout Box (Lower) */}
          <div className="hidden lg:block absolute left-2 xl:left-8 top-[55%] -translate-y-1/2 w-[340px] xl:w-[380px] h-[125px] xl:h-[135px] z-20 pointer-events-auto">
            <HudBox
              variant="shape1"
              leaderSide="right"
              badge="AFFILIATION // 01"
              title="BIT MESRA"
              subtitle="OFFICIAL ROBOTICS CLUB"
              description="STUDENT HUB FOR AUTONOMOUS SYSTEMS & MECHATRONICS."
            />
          </div>

          {/* Rover 3D Canvas */}
          <div className="relative z-10 w-full max-w-4xl sm:max-w-5xl h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center pointer-events-none">
            <RoverWireframe3D />
          </div>

          {/* Right HUD Callout Box (Upper Right) */}
          <div className="hidden lg:block absolute right-2 xl:right-8 top-[36%] -translate-y-1/2 w-[340px] xl:w-[380px] h-[125px] xl:h-[135px] z-20 pointer-events-auto">
            <HudBox
              variant="shape2"
              leaderSide="left"
              badge="CORE DIRECTIVE // 02"
              title="PIONEERING INNOVATION"
              subtitle="REDEFINING ROBOTICS"
              description="ADVANCED PLANETARY EXPLORER & AI TELEMETRY."
            />
          </div>

          {/* EST Tag (Positioned cleanly in the lower right) */}
          <div className="hidden lg:block absolute right-2 xl:right-8 bottom-12 xl:bottom-16 w-[260px] xl:w-[290px] h-[36px] xl:h-[40px] opacity-85 z-20 pointer-events-auto hover:opacity-100 transition-opacity">
            <HudBox compact={true} title="EST. 2001 // BIT MESRA" />
          </div>
        </div>

        {/* Mobile / Tablet HUD Boxes (< lg) */}
        <div className="lg:hidden w-full max-w-md flex flex-col sm:flex-row gap-3 pointer-events-auto mt-[-10px] mb-2 px-2 z-20">
          <div className="w-full sm:w-1/2 h-[120px]">
            <HudBox
              variant="shape1"
              leaderSide="right"
              badge="AFFILIATION // 01"
              title="BIT MESRA"
              subtitle="OFFICIAL ROBOTICS CLUB"
            />
          </div>
          <div className="w-full sm:w-1/2 flex flex-col gap-1">
            <div className="h-[120px]">
              <HudBox
                variant="shape2"
                leaderSide="left"
                badge="DIRECTIVE // 02"
                title="PIONEERING INNOVATION"
                subtitle="REDEFINING ROBOTICS"
              />
            </div>
            <div className="h-[32px] w-4/5 self-end opacity-75 mt-4">
               <HudBox compact={true} title="EST. 2001 // BIT MESRA" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Area: About Us & Contact Us */}
      <footer className="relative z-20 w-full pb-6 sm:pb-8 flex flex-col items-center pointer-events-none pl-14 sm:pl-0">
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6 mb-4">
          <button className="group relative px-7 sm:px-9 py-2.5 sm:py-3 rounded-full bg-white text-black font-arcade text-[8px] sm:text-[9.5px] tracking-wider uppercase transition-all duration-300 hover:bg-slate-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.7)] active:scale-95 cursor-pointer">
            About Us
          </button>
          <button className="group relative px-7 sm:px-9 py-2.5 sm:py-3 rounded-full bg-black/60 border border-white/30 text-white font-arcade text-[8px] sm:text-[9.5px] tracking-wider uppercase backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 cursor-pointer">
            Contact Us
          </button>
        </div>
      </footer>
    </main>
  );
}
