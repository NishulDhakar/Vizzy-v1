"use client";

import React from 'react';
import { GridImage } from './ImageGrid';
import { IconWand, IconRefresh, IconDownload, IconPlus, IconClose } from '../ui/Icons';

export interface ImageResultProps {
  image: GridImage;
  onClose: () => void;
}

export const ImageResult: React.FC<ImageResultProps> = ({ image, onClose }) => {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-[rgba(5,4,10,0.72)] backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1180px] max-h-full bg-[var(--vz-bg-1)] border border-[var(--vz-line-strong)] rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-[18px] py-3 border-b border-[var(--vz-line)]">
          <div className="flex items-center gap-2 text-[12.5px] text-[var(--vz-fg-0)]">
            <span className="text-[var(--vz-fg-2)]">Skyline at dusk, low poly</span>
            <span className="text-[var(--vz-fg-3)]">/</span>
            <span>Result 02 · {image.label || "Expanded"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {["←","02 / 04","→"].map((t,i) => i===1
              ? <span key={i} className="font-mono text-[11px] text-[var(--vz-fg-2)] px-1.5">{t}</span>
              : <button key={i} className="w-7 h-7 grid place-items-center rounded-[7px] bg-[var(--vz-bg-2)] border border-[var(--vz-line)] text-[var(--vz-fg-1)] hover:bg-[var(--vz-bg-3)] transition-colors font-mono text-[12px] cursor-pointer">{t}</button>
            )}
            <div className="w-px h-[18px] bg-[var(--vz-line)] mx-1"/>
            <button onClick={onClose} className="w-7 h-7 grid place-items-center rounded-[7px] bg-[var(--vz-bg-2)] border border-[var(--vz-line)] text-[var(--vz-fg-1)] hover:bg-[var(--vz-bg-3)] transition-colors cursor-pointer">
              <IconClose size={14}/>
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="flex flex-1 min-h-0">
          {/* Stage */}
          <div className={`vz-${image.thumb || 'stripes-warm'} flex-1 relative grid place-items-center min-h-[480px]`}>
            <div className="flex flex-col items-center">
              <span className="text-[220px] leading-none font-[var(--vz-font-display)] text-[rgba(255,255,255,0.5)]">{image.glyph}</span>
              <span className="vz-placeholder-label mt-3">{image.label || '1024×1024'}</span>
            </div>
          </div>

          {/* Sidebar panel */}
          <aside className="w-[360px] shrink-0 border-l border-[var(--vz-line)] bg-[var(--vz-bg-1)] p-5 flex flex-col gap-[22px] overflow-auto">

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <div className="font-mono text-[10.5px] text-[var(--vz-fg-2)] uppercase tracking-[0.07em]">Actions</div>
              {[
                { icon: <IconWand size={15}/>, title:"Refine", sub:"add detail or change parts", primary: false },
                { icon: <IconRefresh size={15}/>, title:"Regenerate", sub:"same prompt, new seed", primary: false },
                { icon: <IconDownload size={15}/>, title:"Download", sub:"1024×1024 · PNG", primary: true },
              ].map((btn) => (
                <button key={btn.title}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left cursor-pointer font-[var(--vz-font-body)] transition-opacity hover:opacity-90 ${
                    btn.primary
                      ? 'bg-gradient-to-b from-[oklch(0.66_0.20_295)] to-[oklch(0.50_0.18_295)] border border-[oklch(0.78_0.20_295/0.5)] text-white shadow-[var(--vz-shadow-glow)]'
                      : 'bg-[var(--vz-bg-2)] border border-[var(--vz-line-strong)] text-[var(--vz-fg-0)]'
                  }`}
                >
                  {btn.icon}
                  <div className="flex flex-col leading-[1.2]">
                    <span className="text-[13.5px] font-medium">{btn.title}</span>
                    <span className={`text-[11px] mt-0.5 whitespace-nowrap ${btn.primary ? 'text-[rgba(255,255,255,0.7)]' : 'text-[var(--vz-fg-2)]'}`}>{btn.sub}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Prompt */}
            <div className="flex flex-col gap-2">
              <div className="font-mono text-[10.5px] text-[var(--vz-fg-2)] uppercase tracking-[0.07em]">Prompt</div>
              <div className="font-mono text-[11.5px] leading-[1.55] text-[var(--vz-fg-1)] p-3 rounded-[10px] bg-[var(--vz-bg-0)] border border-[var(--vz-line)]">
                A skyline at dusk, low poly geometric, deep violets and amber sky, calm water reflections.
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2">
              <div className="font-mono text-[10.5px] text-[var(--vz-fg-2)] uppercase tracking-[0.07em]">Details</div>
              <dl className="flex flex-col">
                {[["model","gen-flux 1.1"],["seed","8841·02"],["size","1024 × 1024"],["steps","32"],["guidance","5.5"],["elapsed","6.4s"]].map(([k,v])=>(
                  <div key={k} className="flex justify-between py-[6px] border-b border-dashed border-[var(--vz-line)]">
                    <dt className="font-mono text-[11px] text-[var(--vz-fg-2)] uppercase tracking-[0.05em]">{k}</dt>
                    <dd className="font-mono text-[11.5px] text-[var(--vz-fg-0)]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Variations */}
            <div className="flex flex-col gap-2">
              <div className="font-mono text-[10.5px] text-[var(--vz-fg-2)] uppercase tracking-[0.07em]">Variations of this</div>
              <div className="grid grid-cols-4 gap-1.5">
                <button className="vz-stripes-warm aspect-square rounded-[8px] border border-[var(--vz-line)] cursor-pointer p-0"/>
                <button className="vz-stripes-warm aspect-square rounded-[8px] border border-[var(--vz-line)] cursor-pointer p-0"/>
                <button className="vz-stripes-violet aspect-square rounded-[8px] border border-[var(--vz-line)] cursor-pointer p-0"/>
                <button className="aspect-square rounded-[8px] bg-transparent border border-dashed border-[var(--vz-line-strong)] text-[var(--vz-fg-2)] grid place-items-center cursor-pointer">
                  <IconPlus size={14}/>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// Keep legacy styles for Specs page compatibility
export const ir: Record<string, React.CSSProperties> = {};
