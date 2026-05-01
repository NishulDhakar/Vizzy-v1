"use client";

import React, { useRef, useState } from 'react';
import { IconPaperclip, IconImage, IconMic, IconArrowUp, IconClose } from './Icons';
import { transcribeVoice } from '@/lib/api';
import { UploadedFile } from '../chat/ChatApp';
import { useAuth } from '@/context/AuthContext';

export interface ComposerProps {
  value?: string;
  onChange?: (val: string) => void;
  onSend?: (val: string, files?: File[]) => void;
  onVoiceResult?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  imageCount?: number;
  onImageCountChange?: (n: number) => void;
  aspectRatio?: string;
  onAspectRatioChange?: (r: string) => void;
}

const IMAGE_COUNTS = [1, 2, 4] as const;
const ASPECT_RATIOS = ['1:1', '16:9', '4:3', '9:16'] as const;

export const Composer: React.FC<ComposerProps> = ({
  value,
  onChange,
  onSend,
  onVoiceResult,
  placeholder = "Describe what you want to create…",
  disabled = false,
  imageCount = 4,
  onImageCountChange,
  aspectRatio = '1:1',
  onAspectRatioChange,
}) => {
  const { user, signInWithGoogle } = useAuth();
  const [internalValue, setInternalValue] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const text = value !== undefined ? value : internalValue;
  const canSend = (text.trim().length > 0 || attachedFiles.length > 0) && !disabled && !recording && !transcribing;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (onChange) onChange(v);
    else setInternalValue(v);
  };

  const handleSend = () => {
    if (!canSend) return;
    if (onSend) onSend(text.trim(), rawFiles.length > 0 ? rawFiles : undefined);
    if (value === undefined) setInternalValue('');
    // Revoke object URLs after send
    attachedFiles.forEach(f => URL.revokeObjectURL(f.url));
    setAttachedFiles([]);
    setRawFiles([]);
  };

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const previews: UploadedFile[] = files.map(f => ({
      name: f.name,
      url: URL.createObjectURL(f),
      type: f.type,
    }));
    setAttachedFiles(prev => [...prev, ...previews]);
    setRawFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (idx: number) => {
    setAttachedFiles(prev => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
    setRawFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleRecording = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop();
      return;
    }
    setVoiceError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setRecording(false);
        setTranscribing(true);
        try {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const { text: transcribed } = await transcribeVoice(blob);
          if (transcribed) {
            if (onVoiceResult) onVoiceResult(transcribed);
            else setInternalValue(transcribed);
          }
        } catch {
          setVoiceError('Could not transcribe. Try again.');
        } finally {
          setTranscribing(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setVoiceError('Microphone access denied.');
    }
  };

  const cycleImageCount = () => {
    const idx = IMAGE_COUNTS.indexOf(imageCount as typeof IMAGE_COUNTS[number]);
    onImageCountChange?.(IMAGE_COUNTS[(idx + 1) % IMAGE_COUNTS.length]);
  };

  const cycleAspectRatio = () => {
    const idx = ASPECT_RATIOS.indexOf(aspectRatio as typeof ASPECT_RATIOS[number]);
    onAspectRatioChange?.(ASPECT_RATIOS[(idx + 1) % ASPECT_RATIOS.length]);
  };

  return (
    <div className="relative">

    {/* ── Auth gate overlay ─────────────────────────────────────────────────── */}
    {!user && (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-[16px] bg-[var(--vz-bg-1)/0.92] backdrop-blur-[6px] border border-[var(--vz-line-strong)]">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-[14px] font-medium text-[var(--vz-fg-0)]">Sign in to start creating</span>
          <span className="text-[12px] text-[var(--vz-fg-2)]">Your work is saved to your account</span>
        </div>
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2.5 px-4 py-[9px] rounded-[10px] bg-white text-[#1a1a1a] text-[13px] font-medium hover:bg-[#f5f5f5] active:bg-[#e8e8e8] transition-colors cursor-pointer border-none shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>
    )}

    <div
      className={`rounded-[16px] bg-[var(--vz-bg-1)] border border-[var(--vz-line-strong)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] overflow-hidden transition-opacity ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* File attachment previews */}
      {attachedFiles.length > 0 && (
        <div className="flex gap-2 px-4 pt-3 flex-wrap">
          {attachedFiles.map((f, i) => (
            <div key={i} className="relative group shrink-0">
              {f.type.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.url}
                  alt={f.name}
                  className="w-14 h-14 rounded-[8px] border border-[var(--vz-line)] object-cover"
                />
              ) : (
                <div className="vz-stripes w-14 h-14 rounded-[8px] border border-[var(--vz-line)] flex items-end p-1">
                  <span className="vz-placeholder-label text-[9px] truncate max-w-full">{f.name}</span>
                </div>
              )}
              <button
                onClick={() => removeFile(i)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--vz-bg-4)] border border-[var(--vz-line-strong)] text-[var(--vz-fg-2)] grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <IconClose size={8} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.txt,.doc,.docx"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Text area */}
      <div className="px-4 pt-3 pb-2">
<textarea
  value={text}
  onChange={handleChange}
  placeholder={transcribing ? 'Transcribing voice…' : placeholder}
  rows={2}
  disabled={disabled || transcribing}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }}
  className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-none focus:shadow-none resize-none text-[15px] leading-[1.45] text-[var(--vz-fg-0)] placeholder:text-[var(--vz-fg-2)] font-[var(--vz-font-body)]"
/>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 pb-3">
        {/* Left controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleFileClick}
            title="Attach file"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-[var(--vz-fg-2)] hover:bg-[var(--vz-bg-3)] hover:text-[var(--vz-fg-0)] transition-colors cursor-pointer"
          >
            <IconPaperclip size={14} />
          </button>

          {/* <button
            onClick={cycleImageCount}
            title="Number of images to generate"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-[var(--vz-fg-2)] hover:bg-[var(--vz-bg-3)] hover:text-[var(--vz-fg-0)] transition-colors text-[12px] cursor-pointer"
          >
            <IconImage size={14} />
            <span className="font-medium hidden sm:inline">Image · {imageCount}</span>
            <span className="font-mono sm:hidden">{imageCount}</span>
          </button> */}

          {/* <button
            onClick={cycleAspectRatio}
            title="Aspect ratio"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-[var(--vz-fg-2)] hover:bg-[var(--vz-bg-3)] hover:text-[var(--vz-fg-0)] transition-colors text-[12px] font-mono cursor-pointer"
          >
            {aspectRatio}
          </button> */}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          {voiceError && (
            <span className="text-[11px] text-[oklch(0.65_0.18_25)] font-mono">{voiceError}</span>
          )}

          <button
            onClick={toggleRecording}
            title={recording ? 'Stop recording' : transcribing ? 'Transcribing…' : 'Voice input'}
            className={`w-8 h-8 flex items-center justify-center rounded-[9px] transition-all duration-150 cursor-pointer ${
              recording
                ? 'bg-[oklch(0.50_0.22_25)] border border-[oklch(0.65_0.22_25/0.5)] text-white animate-[vzPulse_1.2s_ease-in-out_infinite]'
                : transcribing
                ? 'bg-[var(--vz-bg-3)] border border-[var(--vz-line)] text-[var(--vz-accent)] cursor-default'
                : 'border border-[var(--vz-line)] text-[var(--vz-fg-2)] hover:bg-[var(--vz-bg-3)] hover:text-[var(--vz-fg-0)]'
            }`}
          >
            <IconMic size={15} />
          </button>

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`w-8 h-8 flex items-center justify-center rounded-[9px] transition-all duration-150 ${
              canSend
                ? 'bg-gradient-to-b from-[oklch(0.70_0.20_295)] to-[oklch(0.55_0.18_295)] border border-[oklch(0.78_0.20_295/0.6)] text-white shadow-[var(--vz-shadow-glow)] cursor-pointer'
                : 'bg-[var(--vz-bg-3)] border border-[var(--vz-line)] text-[var(--vz-fg-3)] cursor-not-allowed'
            }`}
          >
            <IconArrowUp size={15} />
          </button>
        </div>
      </div>

      {/* Status bar — hidden on mobile */}
      <div className="hidden sm:flex items-center justify-between px-4 py-1.5 border-t border-[var(--vz-line)] bg-[var(--vz-bg-2)]">
        <div className="flex items-center gap-3 text-[10.5px] font-mono text-[var(--vz-fg-3)]">
          <span><kbd className="opacity-60">↵</kbd> send</span>
          <span><kbd className="opacity-60">⇧↵</kbd> new line</span>
          <span><kbd className="opacity-60">⌘N</kbd> new chat</span>
        </div>
        <span className="text-[10px] font-mono text-[var(--vz-fg-3)]">vizzy v2.4 · gen-flux 1.1</span>
      </div>
    </div>
    </div>
  );
};

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A9.005 9.005 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}
