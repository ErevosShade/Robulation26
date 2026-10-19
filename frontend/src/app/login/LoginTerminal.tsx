'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Shield,
  ShieldAlert,
  CheckCircle2,
  ArrowLeft,
  LogOut,
  Cpu,
  AlertTriangle,
  Loader2,
  Terminal,
  ExternalLink,
  Lock,
  ArrowRight,
  Radio,
  RefreshCw,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { signIn, signOut, useSession } from '@/lib/auth-client';

interface RosterMeResponse {
  authenticated: boolean;
  authorized: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
  roster?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    active: boolean;
  };
  error?: string;
  message?: string;
}

function GoogleLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginTerminal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: isSessionLoading } = useSession();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [rosterState, setRosterState] = useState<{
    isLoading: boolean;
    data: RosterMeResponse | null;
  }>({
    isLoading: true,
    data: null,
  });

  // Query parameter error handling
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorDesc = searchParams.get('error_description');
    if (errorParam) {
      setAuthError(errorDesc || `Authentication error: ${errorParam}`);
    }
  }, [searchParams]);

  // Fetch live server-side roster verification
  const checkRosterAccess = useCallback(async () => {
    setRosterState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        cache: 'no-store',
      });
      const data: RosterMeResponse = await res.json();
      setRosterState({
        isLoading: false,
        data,
      });
    } catch (err: any) {
      setRosterState({
        isLoading: false,
        data: {
          authenticated: false,
          authorized: false,
          error: 'NETWORK_ERROR',
          message: err?.message || 'Failed to connect to roster authority.',
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!isSessionLoading) {
      if (session?.user) {
        checkRosterAccess();
      } else {
        setRosterState({
          isLoading: false,
          data: {
            authenticated: false,
            authorized: false,
            error: 'UNAUTHENTICATED',
          },
        });
      }
    }
  }, [session, isSessionLoading, checkRosterAccess]);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setAuthError(null);

    const redirectTarget = searchParams.get('redirect') || '/inventory';

    try {
      const result = await signIn.social({
        provider: 'google',
        callbackURL: redirectTarget,
      });

      if (result?.error) {
        setIsSigningIn(false);
        setAuthError(result.error.message || 'Google sign-in initiation rejected.');
      }
    } catch (err: any) {
      setIsSigningIn(false);
      setAuthError(err?.message || 'Handshake with identity provider failed.');
    }
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      setRosterState({
        isLoading: false,
        data: {
          authenticated: false,
          authorized: false,
          error: 'UNAUTHENTICATED',
        },
      });
      router.refresh();
    } catch (err: any) {
      console.error('Sign-out error:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const isChecking = isSessionLoading || (Boolean(session?.user) && rosterState.isLoading);
  const isAuthorized = rosterState.data?.authorized === true;
  const isAuthenticated = Boolean(session?.user) || rosterState.data?.authenticated === true;
  const activeUser = rosterState.data?.user || session?.user;
  const activeRole =
    rosterState.data?.roster?.role ||
    (activeUser && 'role' in activeUser ? (activeUser as { role: string }).role : 'member');

  return (
    <div className="w-full max-w-xl mx-auto">
      <GlassCard
        reticle={true}
        badge="SECURITY GATEWAY // SECTOR-0"
        className="p-6 sm:p-9 space-y-6"
      >
        {/* Aerospace HUD Eyebrow Header */}
        <div className="space-y-2 border-b border-white/10 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-sky-400">
              <Radio className="w-3.5 h-3.5 animate-pulse text-sky-400" />
              <span>SYS.AUTH // PROTOCOL: OAUTH2.0-PKCE</span>
            </div>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
              [NODE: BIT-MESRA]
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-sky-400 shrink-0" />
            <span>Robolution Access Terminal</span>
          </h1>

          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            Mechatronics Hardware Catalog &amp; Lab Component Checkout Authentication
          </p>
        </div>

        {/* Global Error Banner (if any) */}
        {authError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-200 font-mono">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold uppercase tracking-wider text-red-300">
                AUTHENTICATION FAULT
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px]">{authError}</p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STATE 1: LOADING SESSION / LIVE ROSTER STATUS                   */}
        {/* ============================================================== */}
        {isChecking ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-sky-400/20 border-t-sky-400 animate-spin" />
              <Cpu className="w-5 h-5 text-sky-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="font-mono text-xs uppercase tracking-widest text-zinc-300">
                ESTABLISHING SECURE TELEMETRY LINK...
              </p>
              <p className="font-mono text-[10px] text-zinc-500">
                Querying session state &amp; roster authorization ledger
              </p>
            </div>
          </div>
        ) : isAuthorized && activeUser ? (
          /* ============================================================== */
          /* STATE 2: AUTHENTICATED & AUTHORIZED OPERATOR                   */
          /* ============================================================== */
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 font-mono text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold uppercase tracking-wider text-emerald-300">
                  OPERATOR CLEARANCE CONFIRMED
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Identity authenticated and active roster record verified. You have full access to
                  the hardware inventory terminal.
                </p>
              </div>
            </div>

            {/* Operator Telemetry Spec Card */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500 uppercase text-[11px]">OPERATOR:</span>
                <span className="text-zinc-100 font-bold">{activeUser.name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500 uppercase text-[11px]">VERIFIED EMAIL:</span>
                <span className="text-zinc-200">{activeUser.email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-500 uppercase text-[11px]">ASSIGNED ROLE:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    activeRole === 'admin'
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                      : 'bg-sky-500/20 border border-sky-500/40 text-sky-300'
                  }`}
                >
                  {activeRole}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 uppercase text-[11px]">ROSTER STATUS:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  ACTIVE &amp; AUTHORIZED
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/inventory"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_28px_rgba(56,189,248,0.55)] active:scale-98"
              >
                <span>ENTER INVENTORY TERMINAL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSigningOut ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogOut className="w-3.5 h-3.5" />
                )}
                <span>TERMINATE SESSION</span>
              </button>
            </div>
          </div>
        ) : isAuthenticated && activeUser ? (
          /* ============================================================== */
          /* STATE 3: AUTHENTICATED BUT NOT ON ROSTER / DEACTIVATED         */
          /* ============================================================== */
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 font-mono text-xs">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold uppercase tracking-wider text-amber-300">
                  ACCESS_DENIED // ROSTER CLEARANCE REQUIRED
                </div>
                <p className="text-zinc-300 text-[11px] leading-relaxed">
                  Your Google identity has been verified, but{' '}
                  <span className="text-white font-semibold">{activeUser.email}</span> is not
                  enrolled on the active Robolution team roster.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 font-mono text-xs text-zinc-400">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="uppercase text-[11px] text-zinc-500">AUTHENTICATED AS:</span>
                <span className="text-zinc-200">{activeUser.email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="uppercase text-[11px] text-zinc-500">ROSTER RECORD:</span>
                <span className="text-amber-400 font-bold uppercase text-[10px]">
                  NOT FOUND / INACTIVE
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400 pt-1">
                Hardware checkouts and reservation privileges are strictly restricted to vetted club
                engineers. Please contact the administrator at{' '}
                <span className="text-sky-300">hamzabitmesra786@gmail.com</span> to have your email
                added to the approved roster.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={checkRosterAccess}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RE-CHECK ROSTER STATUS</span>
              </button>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSigningOut ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogOut className="w-3.5 h-3.5" />
                )}
                <span>SWITCH ACCOUNT</span>
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* STATE 4: UNAUTHENTICATED GUEST -> GOOGLE SIGN-IN               */
          /* ============================================================== */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/15 flex items-start gap-3 font-mono text-xs">
              <Lock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold uppercase tracking-wider text-sky-300">
                  AUTHORIZATION POLICY
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Authentication requires a verified Google account. Access to hardware checkouts is
                  gated by server-side verification against the member roster.
                </p>
              </div>
            </div>

            {/* CONTINUE WITH GOOGLE BUTTON */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="relative group w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
              >
                {/* Mechanical Scanline Accent on Hover */}
                <div className="pointer-events-none absolute -inset-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full duration-1000 transform -skew-x-12" />

                {isSigningIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span className="font-mono">INITIALIZING GOOGLE HANDSHAKE...</span>
                  </>
                ) : (
                  <>
                    <GoogleLogo className="w-4 h-4 shrink-0" />
                    <span>CONTINUE WITH GOOGLE</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  SECURE REDIRECT // accounts.google.com
                </span>
              </div>
            </div>

            {/* Telemetry Footer Callout */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400">
                <span className="text-sky-400">///</span>
                <span className="uppercase tracking-wider">ROSTER ENFORCEMENT NOTICE</span>
              </div>
              <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
                Initial administrator access provisioned for{' '}
                <span className="text-zinc-300 font-semibold">hamzabitmesra786@gmail.com</span>.
                Unapproved Google identities will authenticate successfully but cannot view or
                modify inventory resources.
              </p>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
