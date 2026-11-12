import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Compass, AlertOctagon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020408] text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Background Grid & Ambient Glow */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Telemetry Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Image
              src="/robolution-icon-bright.png"
              alt="Robolution Logo"
              width={32}
              height={32}
              className="object-contain filter drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-modern font-black text-sm text-white tracking-widest leading-none">
              ROBOLUTION
            </span>
            <span className="font-mono text-[9px] text-sky-400 tracking-widest uppercase mt-0.5">
              BIT MESRA // EST. 2001
            </span>
          </div>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span>STATUS: SIGNAL_LOST // 404</span>
        </div>
      </header>

      {/* Central HUD Card */}
      <main className="relative z-10 my-auto max-w-xl mx-auto w-full py-12">
        <div className="relative p-8 sm:p-10 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Technical Corner Brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-sky-400" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-sky-400" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-sky-400" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-sky-400" />

          <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>[ERR_SECTOR: UNKNOWN_VECTOR]</span>
            <span className="text-sky-400 font-bold">/// 404_NOT_FOUND</span>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4" />
              <span>Telemetry Anomaly Encountered</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black font-modern tracking-tight text-white uppercase">
              SECTOR NOT FOUND
            </h1>
            <p className="text-sm font-mono text-zinc-400 leading-relaxed">
              The target telemetry coordinate or sub-routine does not exist in the active Robolution Mission Control index.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-zinc-400 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-zinc-500">BEACON_STATUS:</span>
              <span className="text-red-400">UNREACHABLE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">LAT / LON:</span>
              <span className="text-zinc-300">23.4123&deg; N // 85.4399&deg; E</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">NODE:</span>
              <span className="text-sky-400">BIT_MESRA_MAIN_FRAME</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO MISSION CONTROL</span>
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>EXPLORE EVENTS</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-zinc-600 font-mono text-[10px] uppercase tracking-widest border-t border-white/5 pt-4 gap-2">
        <span>ROBOLUTION &bull; TEAM PRATYUMNIS &bull; BIT MESRA</span>
        <span>SYS.AUTO_RECOVERY // PROTOCOL ACTIVE</span>
      </footer>
    </div>
  );
}
