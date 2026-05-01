"use client";

import React, { useState } from 'react';
import { Sidebar } from '../ui/Sidebar';
import { Composer } from '../ui/Composer';
import { IconHome, IconBriefcase, IconSidebar } from '../ui/Icons';
import { Conversation } from './ChatApp';
import Image from 'next/image';

interface OnboardingProps {
  onSend?: (text: string) => void;
  conversations: Conversation[];
  onSelectConv: (id: string) => void;
  onNewChat: () => void;
  imageCount?: number;
  onImageCountChange?: (n: number) => void;
}

const HOME_SUGGESTIONS = [
  { t: 'Paint my last year\'s feeling', k: 'mood',   thumb: 'stripes-violet',  img: '/suggestions/mood.png' },
  { t: 'Turn photo into artwork',       k: 'photo',  thumb: 'stripes-cool',    img: '/suggestions/photo.png' },
  { t: 'Make a vision board',           k: 'board',  thumb: 'stripes',         img: '/suggestions/board.png' },
  { t: 'Generate a story visual',       k: 'story',  thumb: 'stripes-warm',    img: '/suggestions/story.png' },
  { t: 'Design a tattoo concept',       k: 'tattoo', thumb: 'stripes',         img: '/suggestions/tattoo.png' },
  { t: 'Album cover from a song',       k: 'album',  thumb: 'stripes-violet',  img: '/suggestions/album.png' },
];

const BIZ_SUGGESTIONS = [
  { t: 'Pitch deck cover slides',     k: 'deck',   thumb: 'stripes-cool',   icon: '▤', img: '/suggestions/deck.jpg' },
  { t: 'Brand color exploration',     k: 'brand',  thumb: 'stripes-violet', icon: '◐', img: '/suggestions/brand.jpg' },
  { t: 'Product hero shot ideas',     k: 'hero',   thumb: 'stripes',        icon: '◇', img: '/suggestions/hero.jpg' },
  { t: 'Social posts from a launch',  k: 'social', thumb: 'stripes-warm',   icon: '▦', img: '/suggestions/social.jpg' },
  { t: 'Logo mark variations',        k: 'logo',   thumb: 'stripes-violet', icon: '✦', img: '/suggestions/logo.jpg' },
  { t: 'Editorial illustration',      k: 'edit',   thumb: 'stripes-cool',   icon: '❡', img: '/suggestions/edit.jpg' },
];

const RECENTS_STATIC = [
  { t: 'Skyline at dusk',       k: 'low poly · 4 imgs',  thumb: 'stripes-violet' },
  { t: 'Podcast cover, ep. 12', k: 'minimal · 2 imgs',   thumb: 'stripes-cool' },
  { t: 'Vision board · 2027',   k: 'collage · 9 imgs',   thumb: 'stripes-warm' },
  { t: 'Halcyon logo set',      k: 'marks · 6 imgs',     thumb: 'stripes' },
];

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export const Onboarding: React.FC<OnboardingProps> = ({ onSend, conversations, onSelectConv, onNewChat, imageCount, onImageCountChange }) => {
  const [mode, setMode] = useState<'Home' | 'Business'>('Home');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  const suggestions = mode === 'Home' ? HOME_SUGGESTIONS : BIZ_SUGGESTIONS;

  // Use real recent conversations if available, otherwise show static examples
  const hasRealRecents = conversations.length > 0;

  return (
    <div className="vz-screen flex">
      <Sidebar
        conversations={conversations}
        activeId={null}
        onSelect={onSelectConv}
        onNewChat={onNewChat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 h-full overflow-auto relative bg-[var(--vz-bg-0)]">
        {/* Ambient wash */}
        <div className="vz-violet-wash absolute inset-0 pointer-events-none z-0" />

        {/* Topbar */}
        <header className="relative z-10 flex items-center justify-between px-4 md:px-8 py-4 md:py-[18px] border-b border-[var(--vz-line)]">
          <div className="flex items-center gap-2 text-[13px] text-[var(--vz-fg-0)]">
            {/* Mobile sidebar toggle */}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-[8px] text-(--vz-fg-2) hover:bg-(--vz-bg-2) transition-colors border-none bg-transparent cursor-pointer shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <IconSidebar size={17} />
            </button>
            <span className="hidden sm:inline text-[var(--vz-fg-2)]">Workspace</span>
            <span className="hidden sm:inline text-[var(--vz-fg-3)]">/</span>
            <span>New chat</span>
          </div>
          {/* Mode toggle */}
          <div className="flex p-[3px] rounded-[10px] bg-[var(--vz-bg-2)] border border-[var(--vz-line)]">
            {(['Home', 'Business'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] text-[12.5px] font-medium cursor-pointer border-none font-[var(--vz-font-body)] transition-all
                  ${mode === m
                    ? 'bg-[var(--vz-bg-3)] text-[var(--vz-fg-0)] shadow-[inset_0_0_0_1px_var(--vz-line-strong)]'
                    : 'bg-transparent text-[var(--vz-fg-1)] hover:text-[var(--vz-fg-0)]'
                  }`}
              >
                {m === 'Home' ? <IconHome size={13} /> : <IconBriefcase size={13} />}
                <span>{m}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Hero */}
        <section className="relative z-10 max-w-[820px] mx-auto px-4 sm:px-6 md:px-8 pt-10 md:pt-[72px] pb-8 md:pb-12">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 font-mono text-[11.5px] text-[var(--vz-fg-2)] uppercase tracking-[0.06em] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.66_0.20_295)] shadow-[0_0_8px_oklch(0.66_0.20_295/0.6)]" />
            <span>{formatDate(new Date())}</span>
            <span className="text-[var(--vz-fg-3)]">·</span>
            <span>500 generations available</span>
          </div>

          {/* Heading */}
          <h1 className="font-[var(--vz-font-display)] text-[38px] sm:text-[52px] lg:text-[64px] font-medium leading-[1.05] lg:leading-[1.02] tracking-[-0.03em] lg:tracking-[-0.035em] mt-4 md:mt-5 mb-4 md:mb-[18px] text-[var(--vz-fg-0)]">
            What do you want<br />
            to create{' '}
            <em
              className="not-italic font-normal"
              style={{
                background: 'linear-gradient(120deg, oklch(0.85 0.14 295), oklch(0.66 0.20 295))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              today
            </em>
            ?
          </h1>
          <p className="text-[14px] sm:text-[16px] text-[var(--vz-fg-1)] leading-[1.5] max-w-[560px] mb-6 md:mb-9">
            Describe, sketch, or upload. Vizzy turns ideas into images you can refine in conversation.
          </p>

          <div className="max-w-[760px]">
            <Composer
              onSend={onSend}
              imageCount={imageCount}
              onImageCountChange={onImageCountChange}
              placeholder={
                mode === 'Home'
                  ? 'A quiet room at golden hour, oil painting, soft brush…'
                  : 'A hero image for our spring product launch…'
              }
            />
          </div>
        </section>

        {/* Suggestion cards */}
        <section className="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 pb-8">
          <div className="flex items-baseline justify-between mb-3.5">
            <h2 className="font-[var(--vz-font-display)] text-[15px] font-medium tracking-[-0.005em] text-[var(--vz-fg-0)] m-0 whitespace-nowrap">
              Try one of these
            </h2>
            <span className="font-mono text-[11px] text-[var(--vz-fg-2)] uppercase tracking-[0.06em]">
              {mode.toLowerCase()} prompts
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestions.map(s => (
              <button
                key={s.k}
                onClick={() => onSend?.(s.t)}
                className="flex flex-col bg-[var(--vz-bg-2)] border border-[var(--vz-line)] rounded-[14px] overflow-hidden cursor-pointer text-left font-[var(--vz-font-body)] hover:border-[var(--vz-line-strong)] hover:-translate-y-px transition-all duration-150 p-0"
              >
                <div className={`${s.img ? '' : `vz-${s.thumb}`} h-[100px] relative flex items-center justify-center border-b border-[var(--vz-line)] overflow-hidden`}>
                  {s.img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.img}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.55)] via-transparent to-transparent" />
                  <span className="relative text-[28px] font-[var(--vz-font-display)] text-[rgba(255,255,255,0.85)]">
                    {s.icon}
                  </span>
                  <span className="vz-placeholder-label absolute bottom-2 left-2.5">{s.k}</span>
                </div>
                <div className="flex items-center justify-between px-3.5 py-3">
                  <span className="text-[13.5px] text-[var(--vz-fg-0)] font-medium">{s.t}</span>
                  <span className="text-[var(--vz-fg-2)] text-[14px] font-mono">→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recents */}
        {/* <section className="relative z-10 max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 pb-10">
          <div className="flex items-baseline justify-between mb-3.5">
            <h2 className="font-[var(--vz-font-display)] text-[15px] font-medium tracking-[-0.005em] text-[var(--vz-fg-0)] m-0">
              {hasRealRecents ? 'Pick up where you left off' : 'Example creations'}
            </h2>
            {hasRealRecents && (
              <button className="bg-transparent border-none cursor-pointer text-[var(--vz-fg-1)] text-[12.5px] font-[var(--vz-font-body)] hover:text-[var(--vz-fg-0)] transition-colors">
                View all <span className="opacity-60">↗</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {hasRealRecents
              ? conversations.slice(0, 4).map(c => (
                  <button
                    key={c.id}
                    onClick={() => onSelectConv(c.id)}
                    className="flex items-center gap-2.5 p-2 bg-[var(--vz-bg-1)] border border-[var(--vz-line)] rounded-[12px] cursor-pointer font-[var(--vz-font-body)] text-left hover:bg-[var(--vz-bg-2)] hover:border-[var(--vz-line-strong)] transition-all"
                  >
                    <div className="vz-stripes-violet rounded-[8px] shrink-0">
                      <Image src="/logo.png" width={32} height={32} alt="Vizzy Logo" /> 
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="text-[13px] text-[var(--vz-fg-0)] font-medium truncate">{c.title}</div>
                      <div className="text-[10.5px] text-[var(--vz-fg-2)] font-mono">
                        {c.messages.filter(m => m.role === 'ai').length} replies
                      </div>
                    </div>
                  </button>
                ))
              : RECENTS_STATIC.map(r => (
                  <button
                    key={r.t}
                    onClick={() => onSend?.(r.t)}
                    className="flex items-center gap-2.5 p-2 bg-[var(--vz-bg-1)] border border-[var(--vz-line)] rounded-[12px] cursor-pointer font-[var(--vz-font-body)] text-left hover:bg-[var(--vz-bg-2)] hover:border-[var(--vz-line-strong)] transition-all"
                  >
                    <div className={`vz-${r.thumb} w-11 h-11 rounded-[8px] shrink-0`} />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="text-[13px] text-[var(--vz-fg-0)] font-medium truncate">{r.t}</div>
                      <div className="text-[10.5px] text-[var(--vz-fg-2)] font-mono">{r.k}</div>
                    </div>
                  </button>
                ))}
          </div>
        </section> */}
      </main>
    </div>
  );
};
