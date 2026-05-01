"use client";

import React from 'react';
import { IconArrowUp } from '../ui/Icons';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Bubble } from '../ui/Bubble';
import { Hairline } from '../ui/Hairline';

const colorGroups = [
  { g: "Surface", items: [
    { name: "bg-0", v: "#0a0a0f", note: "app" },
    { name: "bg-1", v: "#101019", note: "panel" },
    { name: "bg-2", v: "#16161f", note: "card" },
    { name: "bg-3", v: "#1c1c27", note: "hover" },
    { name: "bg-4", v: "#24242f", note: "active" },
  ]},
  { g: "Text", items: [
    { name: "fg-0", v: "#f3f1f7", note: "primary" },
    { name: "fg-1", v: "#b8b5c4", note: "secondary" },
    { name: "fg-2", v: "#6f6c7d", note: "tertiary" },
    { name: "fg-3", v: "#44424e", note: "disabled" },
  ]},
  { g: "Accent · violet (oklch hue 295)", items: [
    { name: "accent",      v: "oklch(0.66 0.20 295)", note: "primary" },
    { name: "accent-soft", v: "oklch(0.55 0.16 295)", note: "hover" },
    { name: "accent-deep", v: "oklch(0.38 0.14 295)", note: "deep" },
    { name: "accent-glow", v: "oklch(0.78 0.18 295 / .18)", note: "glow" },
  ]},
];

const typeRows = [
  { label: "Display", spec: "Inter Tight · 500 · -3.5%", style: { fontFamily: "var(--vz-font-display)", fontSize: 48, fontWeight: 500, letterSpacing: "-0.035em" }, sample: "What do you want to create today?" },
  { label: "Section", spec: "Inter Tight · 500 · 15px",  style: { fontFamily: "var(--vz-font-display)", fontSize: 15, fontWeight: 500 }, sample: "Pick up where you left off" },
  { label: "Body",    spec: "Inter · 400 · 14.5px / 1.55", style: { fontFamily: "var(--vz-font-body)", fontSize: 14.5, lineHeight: 1.55, color: "var(--vz-fg-0)" }, sample: "Vizzy turns ideas into a series of images you can refine in conversation." },
  { label: "Mono",    spec: "JetBrains Mono · 11px · UPPER · +6%", style: { fontFamily: "var(--vz-font-mono)", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "var(--vz-fg-2)" }, sample: "prompt v2 · 1024×1024 · seed 8841" },
];

export const Specs: React.FC<{ width?: number | string; height?: number | string }> = ({ width = 1280, height = 720 }) => {
  return (
    <div className="vz-screen overflow-auto p-9" style={{ width, height }}>
      {/* Header */}
      <header className="flex items-end justify-between pb-6 border-b border-[var(--vz-line)] mb-7">
        <div>
          <div className="font-mono text-[11px] text-[var(--vz-fg-2)] uppercase tracking-[0.08em]">Vizzy Chat · Design Spec</div>
          <h1 className="font-[var(--vz-font-display)] text-[32px] font-medium tracking-[-0.03em] mt-2 mb-0">
            Tokens, type & components
          </h1>
        </div>
        <div className="flex flex-col gap-1 items-end">
          {[["theme","dark · violet"],["radii","8 / 12 / 18 / 24"],["grid","4px base"]].map(([k,v])=>(
            <div key={k} className="flex gap-3 font-mono text-[11px]">
              <span className="text-[var(--vz-fg-2)] uppercase tracking-[0.05em]">{k}</span>
              <span className="text-[var(--vz-fg-0)]">{v}</span>
            </div>
          ))}
        </div>
      </header>

      {/* 2-col layout */}
      <div className="grid grid-cols-2 gap-9">

        {/* ── Color ── */}
        <section className="flex flex-col">
          <h2 className="font-[var(--vz-font-display)] text-[14px] font-medium tracking-[-0.005em] mb-4 pb-2 border-b border-[var(--vz-line)] text-[var(--vz-fg-0)]">
            Color
          </h2>
          <div className="flex flex-col gap-[18px]">
            {colorGroups.map(grp => (
              <div key={grp.g}>
                <div className="font-mono text-[10.5px] text-[var(--vz-fg-2)] uppercase tracking-[0.06em] mb-2">{grp.g}</div>
                <div className="grid grid-cols-2 gap-2">
                  {grp.items.map(c => (
                    <div key={c.name} className="flex gap-2.5 items-center p-2 rounded-[10px] bg-[var(--vz-bg-1)] border border-[var(--vz-line)]">
                      <div className="w-10 h-10 rounded-[7px] border border-[var(--vz-line-strong)] shrink-0" style={{ background: c.v }}/>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="text-[12px] font-medium text-[var(--vz-fg-0)]">{c.name}</div>
                        <div className="font-mono text-[10.5px] text-[var(--vz-fg-1)] truncate">{c.v}</div>
                        <div className="font-mono text-[10px] text-[var(--vz-fg-2)] uppercase tracking-[0.05em]">{c.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Typography + Components ── */}
        <section className="flex flex-col">
          <h2 className="font-[var(--vz-font-display)] text-[14px] font-medium tracking-[-0.005em] mb-4 pb-2 border-b border-[var(--vz-line)] text-[var(--vz-fg-0)]">
            Typography
          </h2>

          {typeRows.map(row => (
            <div key={row.label} className="grid grid-cols-[180px_1fr] items-center gap-4 py-3.5 border-b border-dashed border-[var(--vz-line)]">
              <div className="flex flex-col gap-0.5">
                <div className="text-[12px] font-medium text-[var(--vz-fg-0)]">{row.label}</div>
                <div className="font-mono text-[10.5px] text-[var(--vz-fg-2)]">{row.spec}</div>
              </div>
              <div style={row.style} className="text-[var(--vz-fg-0)]">{row.sample}</div>
            </div>
          ))}

          <h2 className="font-[var(--vz-font-display)] text-[14px] font-medium tracking-[-0.005em] mt-6 mb-4 pb-2 border-b border-[var(--vz-line)] text-[var(--vz-fg-0)]">
            Components
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Primary button */}
            <div className="bg-[var(--vz-bg-1)] border border-[var(--vz-line)] rounded-[10px] overflow-hidden">
              <div className="font-mono text-[10px] text-[var(--vz-fg-2)] uppercase tracking-[0.05em] px-3 py-2 border-b border-[var(--vz-line)]">Primary button</div>
              <div className="p-3 flex justify-center">
                <Button variant="primary"><IconArrowUp size={14}/> Send message</Button>
              </div>
            </div>

            {/* Chip / pill */}
            <div className="bg-[var(--vz-bg-1)] border border-[var(--vz-line)] rounded-[10px] overflow-hidden">
              <div className="font-mono text-[10px] text-[var(--vz-fg-2)] uppercase tracking-[0.05em] px-3 py-2 border-b border-[var(--vz-line)]">Chip / pill</div>
              <div className="p-3 flex justify-center gap-1.5">
                <Chip variant="solid">Image · 4</Chip>
                <Chip variant="outline">16:9</Chip>
              </div>
            </div>

            {/* Bubbles */}
            <div className="bg-[var(--vz-bg-1)] border border-[var(--vz-line)] rounded-[10px] overflow-hidden">
              <div className="font-mono text-[10px] text-[var(--vz-fg-2)] uppercase tracking-[0.05em] px-3 py-2 border-b border-[var(--vz-line)]">Bubbles</div>
              <div className="p-3 flex flex-col gap-2">
                <Bubble role="user">User · keep #2's mood</Bubble>
                <Bubble role="ai">AI · pulling the warm sky from #2…</Bubble>
              </div>
            </div>

            {/* Hairline */}
            <div className="bg-[var(--vz-bg-1)] border border-[var(--vz-line)] rounded-[10px] overflow-hidden">
              <div className="font-mono text-[10px] text-[var(--vz-fg-2)] uppercase tracking-[0.05em] px-3 py-2 border-b border-[var(--vz-line)]">Hairline</div>
              <div className="p-4 flex flex-col gap-1.5">
                <Hairline />
                <span className="font-mono text-[10px] text-[var(--vz-fg-2)]">1px · rgba(255,255,255,.06)</span>
                <Hairline strong />
                <span className="font-mono text-[10px] text-[var(--vz-fg-2)]">1px · rgba(255,255,255,.10)</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
