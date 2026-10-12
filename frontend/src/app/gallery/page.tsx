'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import HudBox from '@/components/HudBox';
import MoltenMetal from '@/components/MoltenMetal';
import GlassCard from '@/components/GlassCard';
import IslandButton from '@/components/IslandButton';
import DecryptedText from '@/components/DecryptedText';
import CadInspectorModal from '@/components/CadInspectorModal';
import {
  Image as ImageIcon,
  ChevronRight,
  Maximize2,
  Cpu,
  Wrench,
  Trophy,
  Flame,
  Activity,
  Layers,
  Sparkles,
  Mail,
  Box
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Prototypes' | 'Robocon Bots' | 'Combat Mechatronics' | 'Lab Fabrication';
  description: string;
  tag: string;
  specs: string;
  accent: string;
  modelPath: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Autonomous Exploration Rover Testbed',
    category: 'Prototypes',
    description: 'Rocker-bogie suspension system with multi-terrain articulated wheels and stereo-vision camera mast for autonomous terrain mapping.',
    tag: 'EXPLORATION CHASSIS',
    specs: '6-Wheel Rocker-Bogie • ROS 2 Navigation • Depth Sensor Mast',
    accent: '#FF9FFC',
    modelPath: '/curiosity.glb'
  },
  {
    id: 'g2',
    title: 'ABU Robocon High-Speed Omni-Drive Base',
    category: 'Robocon Bots',
    description: 'Precision omni-directional mobile base with custom planetary gearbox reductions, designed for rapid field trajectory shifting and high-torque braking.',
    tag: 'NATIONAL ROBOCON',
    specs: '3x Omni-Wheel Drive • Custom ESCs • 100/100 CAD Heritage',
    accent: '#5227FF',
    modelPath: '/buggy.glb'
  },
  {
    id: 'g3',
    title: 'RoboWars 30kg Combat Drum Spinner',
    category: 'Combat Mechatronics',
    description: 'Hardox-500 armored combat robot featuring a 6,000 RPM high-inertia asymmetric drum spinner weapon powered by a 50V brushless motor.',
    tag: 'ROBOSAGA ARENA',
    specs: '30kg Weight Class • 6000 RPM Weapon • Bulletproof Lexan Tested',
    accent: '#f43f5e',
    modelPath: '/saw.glb'
  },
  {
    id: 'g4',
    title: 'Custom Planetary Gearbox & Motor Shields',
    category: 'Prototypes',
    description: 'In-house designed high-amperage H-bridge motor driver PCBs with optocoupler galvanic isolation, current sensing, and aluminum heatsink thermal channels.',
    tag: 'EMBEDDED HARDWARE',
    specs: '4-Layer PCB • 60A Peak per Channel • Planetary Reduction Core',
    accent: '#10b981',
    modelPath: '/gearbox.glb'
  },
  {
    id: 'g5',
    title: 'Precision Micro-Mouse Maze Pathfinder',
    category: 'Prototypes',
    description: 'Ultra-lightweight composite chassis equipped with 6 high-speed infrared optical distance sensors and dual coreless DC motors for micromouse sprint runs.',
    tag: 'AUTONOMOUS SPRINT',
    specs: 'Flood-fill Algorithmic Core • 3.2 m/s Top Sprint • Carbon Fiber Base',
    accent: '#38bdf8',
    modelPath: '/buggy.glb'
  },
  {
    id: 'g6',
    title: 'Tactical Mechatronics Visor & CNC Milling',
    category: 'Lab Fabrication',
    description: 'Late-night machining and assembly at BIT Mesra mechatronics workshop: turning aircraft-grade 6061-T6 aluminum hubs and laser-cutting structural ribs.',
    tag: 'CAMPUS WORKSHOP',
    specs: '6061-T6 Aluminum • CNC Milling • Midnight Testing Rituals',
    accent: '#a855f7',
    modelPath: '/helmet.glb'
  }
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Prototypes', 'Robocon Bots', 'Combat Mechatronics', 'Lab Fabrication'];

  const filteredItems = filter === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === filter);

  return (
    <div className="relative w-full min-h-screen bg-[#020307] text-white font-sans selection:bg-[#5227FF]/40 selection:text-[#FF9FFC] overflow-x-hidden">
      {/* Background MoltenMetal WebGL Caustics */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <MoltenMetal
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.18}
          scale={4.3}
          detail={3}
          glow={1.55}
          coreSize={0.1}
          swirl={1}
          fold={-0.22}
          blackPoint={0.13}
          brightness={0.45}
          colorMode="molten"
          grain={true}
          grainIntensity={0.05}
          mouseInteraction={true}
          mouseStrength={0.3}
          opacity={0.95}
        />
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_35%,#020307_92%] opacity-60" />
      </div>

      {/* Left Smooth Sidebar */}
      <Sidebar theme="dark" />

      {/* Top Right Corner Tech Box */}
      <div className="absolute top-0 right-0 z-30 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] opacity-95 hover:opacity-100 transition-opacity pointer-events-auto">
        <HudBox compact={true} theme="dark" title="EST. 2001 // BIT MESRA" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pt-20 sm:pt-28 pb-24 px-6 sm:px-12 pl-16 sm:pl-24 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-slate-400 mb-6 uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">Mission Control</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF9FFC]">Build Archives &amp; Gallery</span>
        </div>

        {/* Hero Title Section */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] animate-pulse" />
            <DecryptedText
              text="// HARDWARE ARCHIVES • MECHATRONIC CHRONICLES"
              animateOn="view"
              speed={28}
              sequential={true}
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className="text-slate-300"
            />
          </div>

          <h1 className="font-modern font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.05]">
            HARDWARE SCHEMATICS &amp; <br />
            <span className="animate-text-shimmer">
              PROTOTYPING VAULT
            </span>
          </h1>

          <p className="font-modern text-base sm:text-lg text-slate-300 max-w-3xl mt-6 leading-relaxed">
            A visual and technical record of precision mechatronic mechanisms, high-torque combat chassis, autonomous micro-rovers, and lab fabrication engineering at Birla Institute of Technology, Mesra.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md ${
                filter === cat
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                  : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid with Double-Bezel GlassCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {filteredItems.map(item => (
            <GlassCard
              key={item.id}
              spotlightColor="rgba(255, 159, 252, 0.22)"
              className="p-8 flex flex-col justify-between"
            >
              {/* Graphic Blueprint Placeholder Card */}
              <div
                onClick={() => setActiveItem(item)}
                className="relative w-full h-48 rounded-xl bg-black/50 border border-white/10 mb-6 overflow-hidden flex flex-col items-center justify-center p-6 text-center group-hover:border-white/30 transition-all shadow-inner cursor-pointer"
              >
                <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%]" />
                
                {/* Technical Grid Overlay */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                />

                <div
                  className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-3 border transition-transform group-hover:scale-110 shadow-[0_0_15px_rgba(82,39,255,0.25)]"
                  style={{
                    borderColor: `${item.accent}50`,
                    backgroundColor: `${item.accent}15`,
                    color: item.accent
                  }}
                >
                  <Cpu className="w-6 h-6" />
                </div>

                <span className="relative z-10 font-mono text-[9px] uppercase tracking-widest text-slate-300">
                  {item.specs}
                </span>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-[#5227FF]/20 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs uppercase tracking-wider font-bold">
                  <Box className="w-4 h-4 text-[#FF9FFC]" />
                  <span>Inspect 3D CAD</span>
                </div>
              </div>

              {/* Information */}
              <div>
                <span
                  className="font-mono text-[9px] tracking-widest uppercase font-bold px-2.5 py-0.5 rounded-full border mb-3 inline-block shadow-[0_0_8px_rgba(255,159,252,0.15)]"
                  style={{
                    color: item.accent,
                    borderColor: `${item.accent}50`,
                    backgroundColor: `${item.accent}15`
                  }}
                >
                  {item.tag}
                </span>

                <h3 className="font-modern font-black text-xl text-white uppercase tracking-tight">
                  {item.title}
                </h3>

                <p className="font-modern text-xs text-slate-300 mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Interactive Inspect 3D Action */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#5227FF]/25 border border-white/10 hover:border-[#FF9FFC]/40 font-mono text-[10px] text-white uppercase font-bold tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  <Box className="w-3.5 h-3.5 text-[#FF9FFC]" />
                  <span>Inspect 3D</span>
                </button>

                <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>VERIFIED CAD</span>
                </span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* 3D CAD Hologram Inspector Modal */}
        {activeItem && (
          <CadInspectorModal
            isOpen={!!activeItem}
            onClose={() => setActiveItem(null)}
            title={activeItem.title}
            specs={activeItem.specs}
            tag={activeItem.tag}
            modelPath={activeItem.modelPath}
            accentColor={activeItem.accent}
          />
        )}

        {/* Lab Visit CTA with GlassCard & IslandButton */}
        <GlassCard
          badge="FACILITY ACCESS // CAMPUS TOURS"
          spotlightColor="rgba(82, 39, 255, 0.25)"
          className="p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              WANT TO VISIT OUR MECHATRONICS LAB?
            </h3>
            <p className="font-modern text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              We welcome prospective BIT Mesra students, visiting alumni, and research collaborators to tour our active hardware workstations.
            </p>
          </div>
          <IslandButton
            href="/contact"
            variant="primary"
          >
            Request Lab Tour
          </IslandButton>
        </GlassCard>
      </main>

      {/* Institutional Footer */}
      <footer className="relative z-20 bg-[#04060a]/70 backdrop-blur-xl py-14 px-6 sm:px-12 pl-16 sm:pl-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-modern font-black text-lg text-white uppercase tracking-wider">
              ROBOLUTION &bull; BIT MESRA
            </h4>
            <span className="font-mono text-xs text-slate-400 block mt-1">
              Official Robotics Society &bull; Department of Production &amp; Industrial Engg.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 font-mono text-xs">
            <a
              href="https://www.instagram.com/robolution.bitm/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF9FFC] transition-colors"
            >
              @robolution.bitm
            </a>
            <a
              href="https://www.linkedin.com/company/robolution-bit-mesra/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF9FFC] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:pratyumnis@bitmesra.ac.in"
              className="hover:text-[#FF9FFC] transition-colors flex items-center gap-1.5 font-semibold"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>pratyumnis@bitmesra.ac.in</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
