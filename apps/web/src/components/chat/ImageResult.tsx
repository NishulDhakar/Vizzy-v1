"use client";

import React, { useState } from 'react';
import { GridImage } from './ImageGrid';
import { IconWand, IconRefresh, IconDownload, IconClose } from '../ui/Icons';

export interface ImageResultProps {
  image: GridImage;
  allImages?: GridImage[];
  onClose: () => void;
}

function toProxyUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

function parseImageMeta(url: string | undefined) {
  if (!url) return { prompt: '', seed: '—', size: '1024 × 1024', model: 'gen-flux 1.1' };
  try {
    const u = new URL(url);
    const raw = u.pathname.split('/prompt/')[1] ?? '';
    const prompt = decodeURIComponent(raw.replace(/\+/g, ' '));
    const seed = u.searchParams.get('seed') ?? '—';
    const width = u.searchParams.get('width') ?? '1024';
    const height = u.searchParams.get('height') ?? '1024';
    const model = u.searchParams.get('model') ?? 'flux';
    return { prompt, seed, size: `${width} × ${height}`, model: `gen-${model} 1.1` };
  } catch {
    return { prompt: '', seed: '—', size: '1024 × 1024', model: 'gen-flux 1.1' };
  }
}

export const ImageResult: React.FC<ImageResultProps> = ({ image, allImages, onClose }) => {
  const [current, setCurrent] = useState(image);
  const [imgStatus, setImgStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const images = allImages ?? [image];
  const idx = images.findIndex(im => im.url === current.url);
  const total = images.length;

  const go = (dir: -1 | 1) => {
    const next = images[(idx + dir + total) % total];
    setCurrent(next);
    setImgStatus('loading');
  };

  const meta = parseImageMeta(current.url);

  const handleDownload = () => {
    if (!current.url) return;
    const a = document.createElement('a');
    a.href = current.url;
    a.download = current.label ?? 'vizzy-image.png';
    a.target = '_blank';
    a.click();
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-[rgba(5,4,10,0.72)] backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1180px] max-h-full bg-vz-bg-1 border border-(--vz-line-strong) rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[18px] py-3 border-b border-(--vz-line) shrink-0">
          <div className="flex items-center gap-2 text-[12.5px] text-(--vz-fg-0) min-w-0">
            <span className="text-vz-fg-2 truncate max-w-75">{meta.prompt || 'Generated image'}</span>
            {current.label && (
              <>
                <span className="text-vz-fg-3 shrink-0">/</span>
                <span className="shrink-0">{current.label}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {total > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  className="w-7 h-7 grid place-items-center rounded-[7px] bg-vz-bg-2 border border-(--vz-line) text-vz-fg-1 hover:bg-vz-bg-3 transition-colors font-mono text-[12px] cursor-pointer"
                >←</button>
                <span className="font-mono text-[11px] text-vz-fg-2 px-1.5 tabular-nums">
                  {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <button
                  onClick={() => go(1)}
                  className="w-7 h-7 grid place-items-center rounded-[7px] bg-vz-bg-2 border border-(--vz-line) text-vz-fg-1 hover:bg-vz-bg-3 transition-colors font-mono text-[12px] cursor-pointer"
                >→</button>
                <div className="w-px h-4.5 bg-(--vz-line) mx-1" />
              </>
            )}
            <button onClick={onClose} className="w-7 h-7 grid place-items-center rounded-[7px] bg-vz-bg-2 border border-(--vz-line) text-vz-fg-1 hover:bg-vz-bg-3 transition-colors cursor-pointer">
              <IconClose size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Stage */}
          <div className="flex-1 relative bg-(--vz-bg-0) grid place-items-center min-h-120 overflow-hidden">
            {/* Shimmer while loading */}
            {imgStatus !== 'loaded' && (
              <div className="absolute inset-0 overflow-hidden">
                <div className={`vz-${current.thumb ?? 'stripes'} absolute inset-0 opacity-40`} />
                <div
                  className="absolute inset-0 animate-[vzShimmer_1.8s_linear_infinite]"
                  style={{
                    background: 'linear-gradient(110deg,transparent 30%,oklch(0.66_0.20_295/0.14) 50%,transparent 70%)',
                    backgroundSize: '200% 100%',
                  }}
                />
                {imgStatus === 'error' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-[12px] text-vz-fg-2">failed to load</span>
                  </div>
                )}
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current.url}
              src={toProxyUrl(current.url)}
              alt={current.label ?? 'Generated image'}
              className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${imgStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgStatus('loaded')}
              onError={() => setImgStatus('error')}
            />
          </div>

          {/* Sidebar */}
          <aside className="w-75 shrink-0 border-l border-(--vz-line) bg-vz-bg-1 p-5 flex flex-col gap-5.5 overflow-auto">

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <div className="font-mono text-[10.5px] text-vz-fg-2 uppercase tracking-[0.07em]">Actions</div>
              {[
                { icon: <IconWand size={15} />, title: 'Refine', sub: 'add detail or change parts', primary: false, onClick: undefined },
                { icon: <IconRefresh size={15} />, title: 'Regenerate', sub: 'same prompt, new seed', primary: false, onClick: undefined },
                { icon: <IconDownload size={15} />, title: 'Download', sub: `${meta.size} · PNG`, primary: true, onClick: handleDownload },
              ].map((btn) => (
                <button
                  key={btn.title}
                  onClick={btn.onClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left font-(--vz-font-body) transition-opacity hover:opacity-90 ${
                    btn.primary
                      ? 'bg-gradient-to-b from-[oklch(0.66_0.20_295)] to-[oklch(0.50_0.18_295)] border border-[oklch(0.78_0.20_295/0.5)] text-white shadow-[var(--vz-shadow-glow)] cursor-pointer'
                      : 'bg-vz-bg-2 border border-(--vz-line-strong) text-(--vz-fg-0) cursor-not-allowed opacity-50'
                  }`}
                >
                  {btn.icon}
                  <div className="flex flex-col leading-[1.2]">
                    <span className="text-[13.5px] font-medium">{btn.title}</span>
                    <span className={`text-[11px] mt-0.5 whitespace-nowrap ${btn.primary ? 'text-[rgba(255,255,255,0.7)]' : 'text-vz-fg-2'}`}>{btn.sub}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Prompt */}
            {meta.prompt && (
              <div className="flex flex-col gap-2">
                <div className="font-mono text-[10.5px] text-vz-fg-2 uppercase tracking-[0.07em]">Prompt</div>
                <div className="font-mono text-[11.5px] leading-[1.55] text-vz-fg-1 p-3 rounded-[10px] bg-(--vz-bg-0) border border-(--vz-line)">
                  {meta.prompt}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="flex flex-col gap-2">
              <div className="font-mono text-[10.5px] text-vz-fg-2 uppercase tracking-[0.07em]">Details</div>
              <dl className="flex flex-col">
                {[
                  ['model', meta.model],
                  ['seed', meta.seed],
                  ['size', meta.size],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-[6px] border-b border-dashed border-(--vz-line)">
                    <dt className="font-mono text-[11px] text-vz-fg-2 uppercase tracking-wider">{k}</dt>
                    <dd className="font-mono text-[11.5px] text-(--vz-fg-0)">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Thumbnail strip */}
            {total > 1 && (
              <div className="flex flex-col gap-2">
                <div className="font-mono text-[10.5px] text-vz-fg-2 uppercase tracking-[0.07em]">This generation</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {images.map((im, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrent(im); setImgStatus('loading'); }}
                      className={`aspect-square rounded-[8px] border overflow-hidden cursor-pointer p-0 transition-all ${
                        im.url === current.url
                          ? 'border-[oklch(0.66_0.20_295)] ring-1 ring-[oklch(0.66_0.20_295/0.4)]'
                          : 'border-(--vz-line) hover:border-(--vz-line-strong)'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={toProxyUrl(im.url)}
                        alt={im.label ?? `result ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export const ir: Record<string, React.CSSProperties> = {};
