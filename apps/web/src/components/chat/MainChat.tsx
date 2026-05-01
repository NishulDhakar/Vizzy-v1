"use client";

import React from 'react';
import { Sidebar } from '../ui/Sidebar';
import { Composer } from '../ui/Composer';
import { MessageUser, MessageAi } from './Messages';
import { ImageGrid } from './ImageGrid';
import { IconChevronDown, IconDots } from '../ui/Icons';

export const MainChat: React.FC = () => {
  return (
    <div className="vz-screen flex">
      <Sidebar conversations={[]} activeId={null} onSelect={() => {}} onNewChat={() => {}} />

      <main className="flex-1 h-full flex flex-col bg-[var(--vz-bg-0)] relative">
        {/* Topbar */}
        <header className="flex items-center justify-between px-7 py-[14px] border-b border-[var(--vz-line)] shrink-0">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-[var(--vz-font-display)] text-[14.5px] font-medium text-[var(--vz-fg-0)] tracking-[-0.005em]">
              Skyline at dusk, low poly
            </span>
            <button className="w-[22px] h-[22px] grid place-items-center rounded-[6px] text-[var(--vz-fg-2)] hover:text-[var(--vz-fg-0)] hover:bg-[var(--vz-bg-2)] transition-colors border-none bg-transparent cursor-pointer">
              <IconChevronDown size={14}/>
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-[6px] rounded-[8px] bg-[var(--vz-bg-2)] border border-[var(--vz-line-strong)] text-[var(--vz-fg-0)] text-[12.5px] font-medium hover:bg-[var(--vz-bg-3)] transition-colors cursor-pointer font-[var(--vz-font-body)]">Share</button>
            <button className="w-[30px] h-[30px] grid place-items-center rounded-[8px] bg-transparent border border-[var(--vz-line)] text-[var(--vz-fg-1)] hover:bg-[var(--vz-bg-2)] transition-colors cursor-pointer">
              <IconDots size={16}/>
            </button>
          </div>
        </header>

        {/* Thread */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[820px] mx-auto px-8 pt-8 pb-6 flex flex-col gap-7">
            {/* Day divider */}
            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-[var(--vz-line)]"/>
              <span className="font-mono text-[10.5px] text-[var(--vz-fg-2)] uppercase tracking-[0.06em]">Today · 4:12 PM</span>
              <span className="flex-1 h-px bg-[var(--vz-line)]"/>
            </div>

            <MessageUser>
              A skyline at dusk, low poly geometric, deep violets and amber sky, calm.
            </MessageUser>

            <MessageAi>
              <p className="m-0 text-[14.5px] leading-[1.55] text-[var(--vz-fg-0)]">
                Here are four directions — two leaning into the geometry, two softer
                with painterly skies.{" "}
                <span className="font-mono text-[13px] px-[5px] rounded-[5px] bg-[oklch(0.66_0.20_295/0.18)] text-[oklch(0.85_0.14_295)]">#2</span>
                {" "}matches your reference most closely; want me to push it further?
              </p>
              <ImageGrid
                caption="four directions · prompt v1"
                images={[
                  { thumb: "stripes-violet", glyph: "△", label: "low-poly · cool" },
                  { thumb: "stripes-warm",   glyph: "◇", label: "amber sky · soft" },
                  { thumb: "stripes-cool",   glyph: "◬", label: "geometric · dusk" },
                  { thumb: "stripes",        glyph: "▲", label: "minimal · matte" },
                ]}
              />
            </MessageAi>

            <MessageUser>
              Closer to this reference — keep #2's mood but add reflections on water.
            </MessageUser>

            <MessageAi>
              <p className="m-0 text-[14.5px] leading-[1.55] text-[var(--vz-fg-0)]">
                Got it. Pulling the warm sky from #2, adding a glassy waterline.
                Generating four — should take ~12 seconds.
              </p>
              <ImageGrid
                generating
                caption="refining · prompt v2"
                images={[
                  { loading: true, progress: 0.78, step: "denoising · 25 / 32", thumb: "stripes-warm" },
                  { loading: true, progress: 0.62, step: "denoising · 20 / 32", thumb: "stripes-violet" },
                  { loading: true, progress: 0.41, step: "denoising · 13 / 32", thumb: "stripes-warm" },
                  { loading: true, progress: 0.18, step: "diffusing · step 06",  thumb: "stripes-cool" },
                ]}
              />
            </MessageAi>
          </div>
        </div>

        {/* Composer footer */}
        <footer className="shrink-0 px-8 pb-[22px] bg-gradient-to-b from-transparent to-[var(--vz-bg-0)]">
          <div className="max-w-[820px] mx-auto">
            <Composer placeholder="Ask a follow-up, or describe a new variation…"/>
          </div>
        </footer>
      </main>
    </div>
  );
};
