"use client";

import { useAuth } from '@/context/AuthContext';
import { IconSparkle } from '@/components/ui/Icons';
import Image from 'next/image';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--vz-bg-0)] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-[340px]">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Image src="/logo.png" alt="Vizzy logo" width={32} height={32} className="rounded-[6px]" />
          <div className="text-center">
            <div className="text-[22px] font-semibold text-[var(--vz-fg-0)] font-[var(--vz-font-display)] leading-none">
              Vizzy
            </div>
            <div className="text-[11px] text-[var(--vz-fg-2)] font-mono uppercase tracking-[0.08em] mt-1.5">
              AI Creative Studio
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="w-full bg-[var(--vz-bg-1)] border border-[var(--vz-line)] rounded-[16px] p-6 flex flex-col gap-5">
          <p className="text-[13px] text-[var(--vz-fg-1)] text-center leading-[1.6]">
            Sign in to generate images,<br />search the web, and save your work.
          </p>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-[11px] rounded-[10px]
              bg-white text-[#1a1a1a] text-[13.5px] font-medium
              hover:bg-[#f5f5f5] active:bg-[#e8e8e8]
              transition-colors cursor-pointer border-none shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        <p className="text-[11px] text-[var(--vz-fg-3)] text-center leading-[1.6]">
          By continuing you agree to Vizzy&apos;s terms of service.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A9.005 9.005 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}
