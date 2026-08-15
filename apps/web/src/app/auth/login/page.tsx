"use client";

// ============ AUTH DISABLED ============
// import { useAuth } from '@/context/AuthContext';
// import Image from 'next/image';

export default function LoginPage() {
  // const { signInWithGoogle } = useAuth();

  // AUTH DISABLED - This page is no longer functional
  // Users can now access the app without authentication
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 overflow-hidden">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Disabled</h1>
        <p className="text-gray-400 mb-6">
          Authentication has been disabled. Please navigate to the home page to continue.
        </p>
        <a href="/" className="text-blue-400 hover:text-blue-300">
          Go to Home
        </a>
      </div>
    </div>
  );
}

/*
  Original code - commented out due to auth being disabled:

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 overflow-hidden">
      {/* Immersive background video * /}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-40"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4"
      />
      
      {/* Elegant dark radial overlay and soft blur to merge video with background * /}
      <div className="absolute inset-0 bg-radial-[at_center] from-black/20 via-[#0a0a0f]/80 to-[#0a0a0f] backdrop-blur-[3px] z-1 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-[350px] animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
        
        {/* Logo & Branding * /}
        <div className="relative flex flex-col items-center gap-3.5">
          {/* Soft violet accent glow behind the logo * /}
          <div className="absolute w-28 h-28 rounded-full bg-[var(--vz-accent)] opacity-20 blur-2xl -top-4 pointer-events-none animate-pulse duration-[4000ms]" />
          
          <div className="relative p-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md shadow-2xl">
            <Image 
              src="/logo.png" 
              alt="Vizzy logo" 
              width={40} 
              height={40} 
              className="rounded-[8px]" 
              priority
            />
          </div>
          
          <div className="text-center">
            <h1 className="text-[26px] font-bold text-[var(--vz-fg-0)] tracking-tight font-[var(--vz-font-display)] leading-none">
              Vizzy
            </h1>
            <p className="text-[10px] text-[var(--vz-fg-2)] font-mono uppercase tracking-[0.2em] mt-2">
              AI Creative Studio
            </p>
          </div>
        </div>

        {/* Premium Glassmorphic Card * /}
        <div className="w-full bg-[#101019]/40 backdrop-blur-2xl border border-white/5 rounded-2xl p-8 flex flex-col gap-6 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <p className="text-[13.5px] text-[var(--vz-fg-1)] text-center leading-relaxed">
            Sign in to generate images, search the web, and save your work.
          </p>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl
              bg-white text-black text-[14px] font-semibold
              hover:bg-white/95 active:bg-white/90
              transition-all duration-300 ease-out cursor-pointer border-none
              shadow-[0_4px_12px_rgba(255,255,255,0.08),_0_1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[0_12px_24px_rgba(255,255,255,0.15),_0_4px_8px_rgba(0,0,0,0.1)]
              hover:scale-[1.015] active:scale-[0.985]"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        {/* Minimalist footer terms * /}
        <p className="text-[10.5px] text-[var(--vz-fg-3)] text-center leading-relaxed px-4 transition-opacity duration-300 hover:text-[var(--vz-fg-2)]">
          By continuing, you agree to Vizzy&apos;s terms of service.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A9.005 9.005 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}
*/
// ========================================
