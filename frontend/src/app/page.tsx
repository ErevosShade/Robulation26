'use client';

import React from 'react';
import CursorGrid from "@/components/CursorGrid";
import TechText from "@/components/TechText";
import Sidebar from "@/components/Sidebar";
import RoverWireframe3D from "@/components/RoverWireframe3D";
import HudBox from "@/components/HudBox";
import BottomDock from "@/components/BottomDock";

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

      {/* Top Right Corner Tech Box: EST. 2001 // BIT MESRA (Extreme Top Right Corner) */}
      <div className="fixed top-0 right-0 z-40 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] opacity-95 hover:opacity-100 transition-opacity pointer-events-auto">
        <HudBox compact={true} title="EST. 2001 // BIT MESRA" />
      </div>

      {/* 3D CAD Wireframe Rover Flanked by Sci-Fi HUD Callout Boxes */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center -mt-2 sm:-mt-4 pointer-events-none px-4 pl-14 sm:pl-20">
        {/* Subtle Silver Glow Spotlight in Rover Background */}
        <div
          className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[380px] sm:w-[660px] sm:h-[480px] pointer-events-none z-0 opacity-85"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.30) 0%, rgba(225, 235, 250, 0.15) 35%, rgba(180, 200, 225, 0.04) 62%, transparent 75%)",
            filter: "blur(14px)",
          }}
        />

        {/* Center Container holding Rover & Flanking Desktop HUD Boxes */}
        <div className="relative w-full max-w-[1400px] h-full flex items-center justify-center">
          {/* Left HUD Callout Box (Lower) */}
          <div className="hidden lg:block absolute left-2 xl:left-8 top-[55%] -translate-y-1/2 w-[350px] xl:w-[390px] h-[128px] xl:h-[138px] z-20 pointer-events-auto">
            <HudBox
              variant="shape1"
              leaderSide="right"
              title="BIT MESRA"
              subtitle="OFFICIAL ROBOTICS CLUB"
              description="STUDENT HUB FOR AUTONOMOUS SYSTEMS & MECHATRONICS."
            />
          </div>

          {/* Rover 3D Canvas (Shifted slightly upward) */}
          <div className="relative z-10 w-full max-w-4xl sm:max-w-5xl h-[380px] sm:h-[440px] lg:h-[480px] flex items-center justify-center pointer-events-none -translate-y-6 sm:-translate-y-8">
            <RoverWireframe3D />
          </div>

          {/* Right HUD Callout Box (Upper Right) */}
          <div className="hidden lg:block absolute right-2 xl:right-8 top-[36%] -translate-y-1/2 w-[350px] xl:w-[390px] h-[128px] xl:h-[138px] z-20 pointer-events-auto">
            <HudBox
              variant="shape2"
              leaderSide="left"
              title="PIONEERING INNOVATION"
              subtitle="REDEFINING ROBOTICS"
              description="ADVANCED PLANETARY EXPLORER & AI TELEMETRY."
            />
          </div>
        </div>

        {/* Mobile / Tablet HUD Boxes (< lg) */}
        <div className="lg:hidden w-full max-w-md flex flex-col sm:flex-row gap-3 pointer-events-auto mt-[-10px] mb-2 px-2 z-20">
          <div className="w-full sm:w-1/2 h-[120px]">
            <HudBox
              variant="shape1"
              leaderSide="right"
              title="BIT MESRA"
              subtitle="OFFICIAL ROBOTICS CLUB"
            />
          </div>
          <div className="w-full sm:w-1/2 h-[120px]">
            <HudBox
              variant="shape2"
              leaderSide="left"
              title="PIONEERING INNOVATION"
              subtitle="REDEFINING ROBOTICS"
            />
          </div>
        </div>
      </div>

      {/* Bottom Smooth Trapezoid Dock with Action Buttons */}
      <BottomDock />
    </main>
  );
}
