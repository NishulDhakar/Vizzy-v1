"use client";

import React from 'react';
import { IconSparkle } from '../ui/Icons';
import { UploadedFile } from './ChatApp';
import Image from 'next/image';

export const MessageUser: React.FC<{
  children: React.ReactNode;
  files?: UploadedFile[];
}> = ({ children, files }) => (
  <div className="flex justify-end">
    <div className="max-w-[78%] bg-[var(--vz-user-bubble)] border border-[rgba(255,255,255,0.08)] rounded-2xl px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
      {/* File / image attachments */}
      {files && files.length > 0 && (
        <div className="flex gap-2 mb-2.5 flex-wrap">
          {files.map((f, i) =>
            f.type.startsWith('image/') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={f.url}
                alt={f.name}
                className="w-16 h-16 rounded-[10px] border border-[var(--vz-line)] object-cover"
              />
            ) : (
              <div
                key={i}
                className="vz-stripes w-16 h-16 rounded-[10px] border border-[var(--vz-line)] relative flex items-end"
              >
                <span className="vz-placeholder-label p-1 text-[9px] truncate w-full">{f.name}</span>
              </div>
            )
          )}
        </div>
      )}
      <div className="text-[14.5px] leading-[1.5] text-[var(--vz-fg-0)]">{children}</div>
    </div>
  </div>
);

export const MessageAi: React.FC<{
  children: React.ReactNode;
  label?: string;
  streaming?: boolean;
}> = ({ children, label = 'Vizzy' }) => (
  <div className="flex gap-3 items-start">
    {/* Avatar */}
    {/* <div className="w-7 h-7 rounded-[8px] shrink-0 mt-0.5 flex items-center justify-center">
      <Image src="/logo.png" alt="Vizzy avatar" width={14} height={14} className="rounded-[6px]" />
    </div> */}
    {/* Sparkle accent */}
    {/* <div className="relative">
      <IconSparkle size={12} fill="var(--vz-accent)" stroke="none" className="absolute -top-1 -left-1" />
    </div> */}
    {/* Body */}
    <div className="flex-1 min-w-0 flex flex-col gap-2">
      <div className="flex items-baseline gap-2 text-[13px] text-[var(--vz-fg-0)] font-medium">
        <span>{label}</span>
        {/* <span className="font-mono text-[10.5px] text-[var(--vz-fg-2)]">now</span> */}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  </div>
);
