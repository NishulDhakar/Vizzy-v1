"use client";

import React, { useState } from 'react';
import { IconWand, IconRefresh, IconDownload, IconExpand, IconPlus } from '../ui/Icons';
import { DotmSquare8 } from '../ui/dotm-square-8';

export interface GridImage {
  loading?: boolean;
  progress?: number;
  step?: string;
  thumb?: string;
  glyph?: string;
  label?: string;
  url?: string;
}

export interface ImageGridProps {
  images: GridImage[];
  caption: string;
  generating?: boolean;
  onImageClick?: (img: GridImage) => void;
}

// Per-tile state — keeping retries here avoids any ref mutations during render
interface TileState {
  status: 'pending' | 'loaded' | 'error';
  src: string | undefined;
  retries: number;
}

const initTiles = (imgs: GridImage[]): TileState[] =>
  imgs.map(im => ({ status: 'pending', src: im.url, retries: 0 }));

// Route Pollinations fetches through the Next.js proxy so the browser never
// hits Pollinations directly — avoids their IP rate limiter, staggers by seed,
// and caches for 24 h.
function toProxyUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

// Deterministic seed for retry — avoids Math.random (impure during render).
// Prime shuffle always produces a seed that differs from the original.
function retrySeed(originalUrl: string): number {
  const m = originalUrl.match(/seed=(\d+)/);
  const s = m ? parseInt(m[1], 10) : 0;
  return (s * 31 + 7919) % 10000;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, caption, generating, onImageClick }) => {
  const [tiles, setTiles] = useState<TileState[]>(() => initTiles(images));

  // Adjust state during render when the image set changes — React-recommended
  // pattern (no useEffect, no cascading render, no ref mutation during render).
  const imagesKey = images.map(im => im.url ?? '').join('|');
  const [prevKey, setPrevKey] = useState(imagesKey);
  if (imagesKey !== prevKey) {
    setPrevKey(imagesKey);
    setTiles(initTiles(images));
  }

  const patchTile = (i: number, patch: Partial<TileState>) =>
    setTiles(prev => prev.map((t, j) => (j === i ? { ...t, ...patch } : t)));

  const handleError = (i: number, originalUrl: string) => {
    const currentRetries = tiles[i]?.retries ?? 0;
    if (currentRetries < 1) {
      patchTile(i, { retries: currentRetries + 1 });
      const retryUrl = originalUrl.replace(/seed=\d+/, `seed=${retrySeed(originalUrl)}`);
      setTimeout(() => patchTile(i, { status: 'pending', src: retryUrl }), 2000);
    } else {
      console.error('[Vizzy] Image failed to load after retry:', originalUrl);
      patchTile(i, { status: 'error' });
    }
  };

  const handleDownload = (img: GridImage, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!img.url) return;
    const a = document.createElement('a');
    a.href = img.url;
    a.download = img.label ?? 'vizzy-image.png';
    a.click();
  };

  return (
    <div className="border border-(--vz-line) rounded-[14px] bg-vz-bg-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-(--vz-line)">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.66_0.20_295)] shadow-[0_0_8px_oklch(0.66_0.20_295/0.6)]" />
          <span className="text-[12px] text-vz-fg-1 font-mono uppercase tracking-wider">
            {caption}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10.5px] text-vz-fg-2">1024×1024</span>
          <span className="text-vz-fg-3">·</span>
          <span className="font-mono text-[10.5px] text-vz-fg-2">gen-flux 1.1</span>
        </div>
      </div>

      {/* adaptive grid: 1→full, 2–4→2 cols */}
      <div className={`grid gap-px bg-(--vz-line) ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {images.map((im, i) => {
          const tile = tiles[i] ?? { status: 'pending' as const, src: im.url };
          return (
            <div key={i} className="relative aspect-square bg-vz-bg-2 overflow-hidden">
              {im.loading ? (
                /* ── Loading tile (skeleton sent before real URLs arrive) ── */
                <div className="absolute inset-0 overflow-hidden">
                  <div className={`vz-${im.thumb ?? 'stripes'} absolute inset-0 opacity-50`} />
                  <div
                    className="absolute inset-0 animate-[vzShimmer_1.8s_linear_infinite]"
                    style={{
                      background: 'linear-gradient(110deg,transparent 30%,oklch(0.66_0.20_295/0.16) 50%,transparent 70%)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
                    <div className="grid place-items-center w-8 h-8 bg-vz-bg-1 rounded-[10px] border border-(--vz-line) shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                                      <DotmSquare8 size={20} 
                                      dotSize={2} 
                                      opacityBase={0.1}
                                      opacityMid={0.4}
                                      opacityPeak={0.95}
                                      speed={1.2} />
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-mono text-[13px] text-(--vz-fg-0) font-medium">
                        {Math.round((im.progress ?? 0.4) * 100)}%
                      </span>
                      <span className="font-mono text-[10px] text-vz-fg-2 uppercase tracking-wider">
                        {im.step ?? 'diffusing · step 18 / 32'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : im.url ? (
                /* ── Real image — shimmer until proxy delivers it ── */
                <>
                  {tile.status !== 'loaded' && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="vz-stripes absolute inset-0 opacity-50" />
                      <div
                        className="absolute inset-0 animate-[vzShimmer_1.8s_linear_infinite]"
                        style={{ background: 'linear-gradient(110deg,transparent 30%,oklch(0.66_0.20_295/0.16) 50%,transparent 70%)', backgroundSize: '200% 100%' }}
                      />
                      {tile.status === 'error' ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                          <span className="font-mono text-[11px] text-vz-fg-2">failed to load</span>
                          <span className="font-mono text-[10px] text-vz-fg-3 px-2 text-center break-all">{im.url.slice(0, 60)}…</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="grid place-items-center w-8 h-8 bg-vz-bg-1 rounded-[10px] border border-(--vz-line) shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                                            <DotmSquare8 size={20} 
                                            dotSize={2} 
                                            opacityBase={0.1}
                                            opacityMid={0.4}
                                            opacityPeak={0.95}
                                            speed={1.2} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={toProxyUrl(tile.src ?? im.url)}
                    alt={im.label ?? `result ${i + 1}`}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${tile.status === 'loaded' ? 'opacity-100' : 'opacity-0'} ${onImageClick ? 'cursor-pointer' : ''}`}
                    onLoad={() => patchTile(i, { status: 'loaded' })}
                    onError={() => handleError(i, im.url ?? '')}
                    onClick={() => onImageClick?.(im)}
                  />
                  {tile.status === 'loaded' && (
                    <>
                      <div className="absolute top-2 left-2.5 font-mono text-[10.5px] text-[rgba(255,255,255,0.85)] bg-[rgba(0,0,0,0.5)] px-1.5 py-px rounded backdrop-blur-sm pointer-events-none">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="absolute inset-0 group" onClick={() => onImageClick?.(im)}>
                        <div className="absolute bottom-2 right-2 flex gap-0.5 p-0.5 rounded-[8px] bg-[rgba(10,10,15,0.75)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {[
                            { icon: <IconWand size={13} />, title: 'Refine' },
                            { icon: <IconRefresh size={13} />, title: 'Regenerate' },
                            { icon: <IconDownload size={13} />, title: 'Download' },
                            { icon: <IconExpand size={13} />, title: 'Expand' },
                          ].map((b, bi) => (
                            <button
                              key={bi}
                              title={b.title}
                              onClick={(e) => { e.stopPropagation(); if (b.title === 'Download') handleDownload(im, e); else onImageClick?.(im); }}
                              className="w-6.5 h-6.5 flex items-center justify-center rounded-[5px] text-[rgba(255,255,255,0.85)] hover:bg-[rgba(255,255,255,0.12)] transition-colors cursor-pointer"
                            >
                              {b.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                /* ── Placeholder tile (no URL yet) ── */
                <>
                  <div
                    className={`vz-${im.thumb ?? 'stripes'} absolute inset-0 grid place-items-center ${onImageClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onImageClick?.(im)}
                  >
                    <span className="text-[56px] text-[rgba(255,255,255,0.45)] font-(--vz-font-display)">{im.glyph}</span>
                    <span className="vz-placeholder-label absolute bottom-2 left-2.5">{im.label}</span>
                  </div>
                  <div className="absolute top-2 left-2.5 font-mono text-[10.5px] text-[rgba(255,255,255,0.7)] bg-[rgba(0,0,0,0.4)] px-1.5 py-px rounded backdrop-blur-sm">
                    {String(i + 1).padStart(2, '00')}
                  </div>
                  <div className="absolute bottom-2 right-2 flex gap-0.5 p-0.5 rounded-[8px] bg-[rgba(10,10,15,0.75)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm">
                    {[{ icon: <IconWand size={13} />, title: 'Refine' }, { icon: <IconRefresh size={13} />, title: 'Regenerate' }, { icon: <IconDownload size={13} />, title: 'Download' }, { icon: <IconExpand size={13} />, title: 'Expand' }].map((b, bi) => (
                      <button key={bi} title={b.title} className="w-6.5 h-6.5 flex items-center justify-center rounded-[5px] text-[rgba(255,255,255,0.85)] hover:bg-[rgba(255,255,255,0.08)] transition-colors cursor-pointer">
                        {b.icon}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {generating ? (
        <div className="flex items-center justify-between px-3 py-2.5 border-t border-(--vz-line)">
          <span className="font-mono text-[10.5px] text-vz-fg-2">generating {images.length} variations…</span>
          <span className="font-mono text-[10.5px] text-vz-fg-2 animate-[vzBlink_1s_step-end_infinite]">●</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5 border-t border-(--vz-line)">
          {[
            { icon: <IconRefresh size={12} />, label: 'Regenerate all' },
            { icon: <IconWand size={12} />, label: 'Refine prompt' },
            { icon: <IconPlus size={12} />, label: 'More variations' },
          ].map((b, i) => (
            <button
              key={i}
              className="flex items-center gap-1.5 px-2.5 py-1.25 rounded-[7px] bg-vz-bg-2 border border-(--vz-line) text-vz-fg-1 hover:text-(--vz-fg-0) hover:bg-vz-bg-3 transition-colors text-[11.5px] font-(--vz-font-body) cursor-pointer"
            >
              {b.icon}
              <span className="hidden sm:inline">{b.label}</span>
            </button>
          ))}
          <span className="flex-1" />
          <span className="font-mono text-[10.5px] text-vz-fg-2">{images.length} of {images.length}</span>
        </div>
      )}
    </div>
  );
};
