'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import HudBox from '@/components/HudBox';
import MoltenMetal from '@/components/MoltenMetal';
import GlassCard from '@/components/GlassCard';
import IslandButton from '@/components/IslandButton';
import DecryptedText from '@/components/DecryptedText';
import {
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Clock,
  Compass,
  Sparkles
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
      <div className="hidden sm:block absolute top-0 right-0 z-30 w-[240px] sm:w-[270px] xl:w-[290px] h-[44px] sm:h-[48px] opacity-95 hover:opacity-100 transition-opacity pointer-events-auto">
        <HudBox compact={true} theme="dark" title="EST. 2001 // BIT MESRA" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pt-18 sm:pt-28 pb-20 px-4 sm:px-8 md:pl-24 max-w-7xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-slate-400 mb-6 uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">Mission Control</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF9FFC]">Contact &amp; Lab Coordinates</span>
        </div>

        {/* Hero Title Section */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 shadow-xs font-mono text-[9px] sm:text-[10px] tracking-widest text-slate-300 uppercase mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9FFC] animate-pulse" />
            <DecryptedText
              text="// DIRECT TELEMETRY • COMMUNICATIONS UPLINK • BIT MESRA"
              animateOn="view"
              speed={28}
              sequential={true}
              characters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*"
              className="text-slate-300"
            />
          </div>

          <h1 className="font-modern font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-[1.05]">
            INITIATE CONTACT &amp; <br />
            <span className="animate-text-shimmer">
              LAB TRANSMISSION
            </span>
          </h1>

          <p className="font-modern text-base sm:text-lg text-slate-300 max-w-3xl mt-6 leading-relaxed">
            Have questions regarding RoboSaga &apos;26 registrations, collegiate sponsorships, technical workshops, or campus lab visits? Transmit a dispatch directly to our executive council.
          </p>
        </div>

        {/* Main Grid: Form & Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 mb-24">
          {/* Left Column: Coordinates & Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Coordinates Card with GlassCard */}
            <GlassCard
              badge="PHYSICAL COORDINATES // BIT MESRA"
              spotlightColor="rgba(255, 159, 252, 0.22)"
              className="p-8"
            >
              <div className="space-y-6 font-modern">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#5227FF]/15 border border-[#5227FF]/30 flex items-center justify-center text-[#FF9FFC] shrink-0 mt-1 shadow-[0_0_10px_rgba(82,39,255,0.2)]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block">
                      Physical Workstation
                    </span>
                    <h3 className="font-bold text-white text-base mt-0.5">
                      Birla Institute of Technology, Mesra
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Department of Production &amp; Industrial Engineering<br />
                      Ranchi, Jharkhand &ndash; 835215, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#5227FF]/15 border border-[#5227FF]/30 flex items-center justify-center text-[#FF9FFC] shrink-0 mt-1 shadow-[0_0_10px_rgba(82,39,255,0.2)]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block">
                      Official Society Dispatch
                    </span>
                    <a
                      href="mailto:pratyumnis@bitmesra.ac.in"
                      className="font-bold text-white text-base mt-0.5 hover:text-[#FF9FFC] transition-colors block"
                    >
                      pratyumnis@bitmesra.ac.in
                    </a>
                    <span className="text-xs text-slate-400">Response turnaround: 24&ndash;48 hrs</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#5227FF]/15 border border-[#5227FF]/30 flex items-center justify-center text-[#FF9FFC] shrink-0 mt-1 shadow-[0_0_10px_rgba(82,39,255,0.2)]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block">
                      Telephone Helpline
                    </span>
                    <a
                      href="tel:+917632910105"
                      className="font-bold text-white text-base mt-0.5 hover:text-[#FF9FFC] transition-colors block"
                    >
                      +91 7632910105
                    </a>
                    <span className="text-xs text-slate-400">Mon&ndash;Sat &bull; 10:00 to 18:00 IST</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Social Network Links with GlassCard */}
            <GlassCard
              badge="DIGITAL TRANSMISSION CHANNELS"
              spotlightColor="rgba(82, 39, 255, 0.22)"
              className="p-8"
            >
              <div className="space-y-3 font-mono text-xs">
                <a
                  href="https://www.instagram.com/robolution.bitm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#FF9FFC]/40 hover:bg-white/[0.06] transition-all text-slate-300 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF9FFC]" />
                    <span>Instagram // @robolution.bitm</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href="https://www.linkedin.com/company/robolution-bit-mesra/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#FF9FFC]/40 hover:bg-white/[0.06] transition-all text-slate-300 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#5227FF]" />
                    <span>LinkedIn // Robolution BIT Mesra</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href="https://www.facebook.com/TeamRobolution"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#FF9FFC]/40 hover:bg-white/[0.06] transition-all text-slate-300 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Facebook // TeamRobolution</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: High-Tech Telemetry Transmission Form */}
          <div className="lg:col-span-7">
            <GlassCard
              badge="SECURE DISPATCH CONSOLE // ENCRYPTED UPLINK"
              spotlightColor="rgba(255, 159, 252, 0.25)"
              className="p-8 sm:p-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-modern font-black text-2xl sm:text-3xl text-white uppercase mt-1">
                    TRANSMIT AN INQUIRY
                  </h2>
                </div>
                <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>UPLINK READY</span>
                </div>
              </div>

              {submitted ? (
                <div className="py-16 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-modern font-black text-2xl text-white uppercase">
                    TRANSMISSION DISPATCHED
                  </h3>
                  <p className="font-modern text-sm text-slate-300 mt-2 max-w-md leading-relaxed">
                    Thank you, {formData.name || 'Engineer'}. Your telemetry packet has been logged. Our executive secretaries will review and contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', category: 'General Inquiry', subject: '', message: '' });
                    }}
                    className="mt-8 px-6 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-[#FF9FFC] transition-colors"
                    >
                      <option value="RoboSaga '26 Registration" className="bg-[#05070f] text-white">RoboSaga &apos;26 Registration</option>
                      <option value="Collegiate Sponsorship" className="bg-[#05070f] text-white">Collegiate Sponsorship</option>
                      <option value="Technical Workshop" className="bg-[#05070f] text-white">Technical Workshop</option>
                      <option value="Student Recruitment" className="bg-[#05070f] text-white">Student Recruitment</option>
                      <option value="Lab Visit & Collaboration" className="bg-[#05070f] text-white">Lab Visit &amp; Collaboration</option>
                      <option value="General Inquiry" className="bg-[#05070f] text-white">General Inquiry</option>
                    </select>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Sharma"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-[#FF9FFC] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alex@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-[#FF9FFC] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">
                      Transmission Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. RoboWars 30kg Team Registration Query"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-[#FF9FFC] transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">
                      Dispatch Details *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify team credentials, college affiliation, or project details..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-[#FF9FFC] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5227FF] via-[#FF9FFC] to-[#5227FF] bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-[#5227FF]/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Dispatch To Executive Council</span>
                  </button>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="relative z-20 bg-[#04060a]/70 backdrop-blur-xl py-14 px-4 sm:px-8 md:pl-24">
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
