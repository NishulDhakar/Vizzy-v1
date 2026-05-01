"use client";

import React, { useState } from 'react';
import { IconPlus, IconSearch } from './Icons';
import Image from 'next/image';
import { Conversation } from '../chat/ChatApp';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete?: (id: string) => void;
}

function groupByAge(convs: Conversation[]) {
  const now = Date.now();
  const DAY = 86_400_000;
  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const last7: Conversation[] = [];
  const earlier: Conversation[] = [];

  for (const c of convs) {
    const age = now - c.updatedAt.getTime();
    if (age < DAY) today.push(c);
    else if (age < 2 * DAY) yesterday.push(c);
    else if (age < 7 * DAY) last7.push(c);
    else earlier.push(c);
  }
  return { today, yesterday, last7, earlier };
}

export const Sidebar: React.FC<SidebarProps> = ({ conversations, activeId, onSelect, onNewChat, onDelete }) => {
  const [search, setSearch] = useState('');
  const { user, signOut } = useAuth();

  const filtered = search.trim()
    ? conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
    : conversations;

  const { today, yesterday, last7, earlier } = groupByAge(filtered);

  const totalGenerated = conversations.reduce(
    (acc, c) => acc + c.messages.filter(m => m.role === 'ai').length,
    0
  );

  const ConvItem: React.FC<{ conv: Conversation }> = ({ conv }) => {
    // Use loaded messages count if available, otherwise fall back to server-reported count
    const aiCount = conv.messagesLoaded
      ? conv.messages.filter(m => m.role === 'ai').length
      : Math.floor(conv.messageCount / 2);

    return (
      <div
        onClick={() => onSelect(conv.id)}
        className={`flex items-center justify-between px-2.5 py-1.5 rounded-[8px] mb-0.5 cursor-pointer group transition-colors
          ${conv.id === activeId
            ? 'bg-vz-bg-3 text-(--vz-fg-0)'
            : 'text-vz-fg-1 hover:bg-vz-bg-2 hover:text-(--vz-fg-0)'
          }`}
      >
        <span className="text-[12.5px] truncate leading-none flex-1 min-w-0">{conv.title}</span>
        <div className="ml-2 shrink-0 flex items-center gap-1">
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
              className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded text-vz-fg-3 hover:text-[oklch(0.65_0.18_25)] hover:bg-vz-bg-3 transition-all border-none bg-transparent cursor-pointer"
              title="Delete conversation"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" />
              </svg>
            </button>
          )}
          <span className="text-[10px] font-mono text-vz-fg-3">{aiCount}</span>
        </div>
      </div>
    );
  };

  const Group: React.FC<{ label: string; items: Conversation[] }> = ({ label, items }) => {
    if (!items.length) return null;
    return (
      <div className="mb-4">
        <div className="px-2 mb-1 text-[10px] font-mono uppercase tracking-[0.06em] text-[var(--vz-fg-3)]">
          {label}
        </div>
        {items.map(c => <ConvItem key={c.id} conv={c} />)}
      </div>
    );
  };

  return (
    <aside className="w-[232px] shrink-0 h-full flex flex-col bg-[var(--vz-bg-1)] border-r border-[var(--vz-line)] overflow-hidden">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-[var(--vz-line)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] flex items-center justify-center bg-gradient-to-br from-[oklch(0.66_0.20_295)] to-[oklch(0.42_0.16_295)] border border-[oklch(0.78_0.18_295/0.4)] shadow-[0_0_0_3px_oklch(0.55_0.16_295/0.10)]">
            <Image src="/logo.png" alt="Vizzy" width={24} height={24} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[var(--vz-fg-0)] font-[var(--vz-font-display)] leading-none">
              Vizzy
            </div>
            <div className="text-[10px] text-[var(--vz-fg-2)] font-mono uppercase tracking-[0.05em] mt-0.5">
              Studio · Pro
            </div>
          </div>
        </div>
        <button className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[var(--vz-fg-2)] hover:bg-[var(--vz-bg-3)] hover:text-[var(--vz-fg-0)] transition-colors border border-transparent hover:border-[var(--vz-line-strong)] cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="12" height="1.5" rx="0.75" />
            <rect x="2" y="7.25" width="8" height="1.5" rx="0.75" />
            <rect x="2" y="11.5" width="10" height="1.5" rx="0.75" />
          </svg>
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-[9px] text-[var(--vz-fg-1)] bg-[var(--vz-bg-2)] border border-[var(--vz-line-strong)] hover:bg-[var(--vz-bg-3)] hover:text-[var(--vz-fg-0)] transition-colors text-[12.5px] font-medium cursor-pointer"
        >
          <IconPlus size={14} />
          <span>New chat</span>
          <span className="ml-auto font-mono text-[10px] text-[var(--vz-fg-3)] border border-[var(--vz-line-strong)] rounded px-1">
            ⌘N
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[var(--vz-bg-2)] border border-[var(--vz-line)]">
          <IconSearch size={13} className="shrink-0 text-[var(--vz-fg-3)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chats…"
            className="flex-1 bg-transparent border-none outline-none text-[12px] text-[var(--vz-fg-1)] placeholder:text-[var(--vz-fg-3)] font-[var(--vz-font-body)]"
          />
        </div>
      </div>

      {/* History */}
      <div className="flex-1 overflow-auto px-1.5 pt-1 pb-2">
        {conversations.length === 0 ? (
          <div className="px-3 py-10 text-center">
            <p className="text-[11.5px] text-[var(--vz-fg-3)] font-mono leading-[1.6]">
              No chats yet.<br />Start creating.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <p className="text-[11.5px] text-[var(--vz-fg-3)] font-mono">No results for &ldquo;{search}&rdquo;</p>
          </div>
        ) : (
          <>
            <Group label="Today" items={today} />
            <Group label="Yesterday" items={yesterday} />
            <Group label="Last 7 days" items={last7} />
            <Group label="Earlier" items={earlier} />
          </>
        )}
      </div>

      {/* User footer */}
      <div className="px-3 pb-4 pt-2 border-t border-[var(--vz-line)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {user?.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="avatar"
              width={28}
              height={28}
              className="w-7 h-7 rounded-full shrink-0 object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[oklch(0.55_0.16_295)] to-[oklch(0.38_0.14_295)] flex items-center justify-center text-white font-semibold text-[11px] shrink-0">
              {(user?.user_metadata?.name ?? user?.email ?? 'U')[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-[12px] font-medium text-[var(--vz-fg-0)] leading-none truncate">
              {user?.user_metadata?.name ?? user?.email ?? 'User'}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-[2px] w-[36px] rounded-full bg-[var(--vz-bg-4)] overflow-hidden shrink-0">
                <div
                  className="h-full bg-[var(--vz-accent)] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalGenerated / 500) * 100)}%` }}
                />
              </div>
              <span className="text-[9.5px] font-mono text-[var(--vz-fg-2)] whitespace-nowrap">
                {totalGenerated} / 500 gen
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={signOut}
          title="Sign out"
          className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[var(--vz-fg-2)] hover:bg-[var(--vz-bg-3)] hover:text-[oklch(0.65_0.18_25)] transition-colors shrink-0 cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" />
            <path d="M11 11l3-3-3-3" />
            <line x1="14" y1="8" x2="6" y2="8" />
          </svg>
        </button>
      </div>
    </aside>
  );
};
