"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from '../ui/Sidebar';
import { Composer } from '../ui/Composer';
import { MessageUser, MessageAi } from './Messages';
import { ImageGrid, GridImage } from './ImageGrid';
import { IconChevronDown, IconDots } from '../ui/Icons';
import { ImageResult } from './ImageResult';
import { Onboarding } from './Onboarding';
import { DotmSquare18 } from '../ui/dotm-square-18';
import {
  sendChat,
  fetchConversations,
  fetchHistory,
  deleteConversation,
  SearchResult,
} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLocalStorage, lsGet, lsSet, lsRemove } from '@/lib/useLocalStorage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  displayText: string;
  streaming: boolean;
  files?: UploadedFile[];
  images?: GridImage[];
  imageLoading?: boolean;
  intent?: 'chat' | 'image' | 'search';
  searchResults?: SearchResult[];
  error?: boolean;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  messageCount: number;
  messagesLoaded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatAppProps {
  initialConvId?: string;
}

// Compact shape stored under vizzy_chats (no messages, Date → ISO string)
interface StoredChat {
  id: string;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

// Shape stored under vizzy_messages_{id}
interface StoredMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  error?: boolean;
  images?: GridImage[];
}

// ─── localStorage keys ────────────────────────────────────────────────────────

const LS_CHATS  = 'vizzy_chats';
const LS_ACTIVE = 'vizzy_active_chat';
const lsMsgKey  = (id: string) => `vizzy_messages_${id}`;

// ─── Converters ───────────────────────────────────────────────────────────────

function chatToStored(c: Conversation): StoredChat {
  return { id: c.id, title: c.title, messageCount: c.messageCount, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString() };
}
function storedToChat(s: StoredChat): Conversation {
  return { ...s, messages: [], messagesLoaded: false, createdAt: new Date(s.createdAt), updatedAt: new Date(s.updatedAt) };
}
function msgToStored(m: ChatMessage): StoredMessage {
  return { id: m.id, role: m.role, text: m.text, timestamp: m.timestamp.toISOString(), error: m.error, images: m.images };
}
function storedToMsg(s: StoredMessage): ChatMessage {
  return { id: s.id, role: s.role, text: s.text, displayText: s.text, streaming: false, error: s.error, images: s.images, timestamp: new Date(s.timestamp) };
}
function saveMessages(convId: string, messages: ChatMessage[]) {
  lsSet(lsMsgKey(convId), messages.filter(m => !m.streaming).map(msgToStored));
}

// ─── Utilities ────────────────────────────────────────────────────────────────

const genId     = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const newConvId = () => crypto.randomUUID();
const truncate  = (s: string, n = 42) => s.length > n ? s.slice(0, n).trimEnd() + '…' : s;
const THUMB_CYCLE = ['stripes-violet', 'stripes-warm', 'stripes-cool', 'stripes'] as const;

function startTypewriter(text: string, onTick: (p: string) => void, onDone: () => void): () => void {
  let i = 0;
  const id = setInterval(() => {
    i += 4;
    if (i >= text.length) { clearInterval(id); onTick(text); onDone(); }
    else onTick(text.slice(0, i));
  }, 16);
  return () => clearInterval(id);
}

function pushUrl(path: string) {
  window.history.pushState(null, '', path);
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ChatApp: React.FC<ChatAppProps> = ({ initialConvId }) => {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  // vizzy_chats — sidebar list restored from localStorage on first render
  const [storedChats, setStoredChats] = useLocalStorage<StoredChat[]>(LS_CHATS, []);
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const activeTargetId = initialConvId ?? lsGet<string | null>(LS_ACTIVE, null);
    return storedChats.map(c => {
      if (c.id === activeTargetId) {
        const cached = lsGet<StoredMessage[]>(lsMsgKey(c.id), []);
        if (cached.length > 0) {
          return { ...storedToChat(c), messages: cached.map(storedToMsg), messagesLoaded: true };
        }
      }
      return storedToChat(c);
    });
  });

  // vizzy_active_chat — URL param wins, otherwise localStorage
  const [storedActiveId, setStoredActiveId, removeStoredActiveId] =
    useLocalStorage<string | null>(LS_ACTIVE, null);
  const [activeId, setActiveId] = useState<string | null>(initialConvId ?? storedActiveId);

  const [composerText, setComposerText]     = useState('');
  const [imageCount, setImageCount]         = useState(4);
  const [aspectRatio, setAspectRatio]       = useState('1:1');
  const [expandedImage, setExpandedImage]   = useState<GridImage | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(() => {
    const activeTargetId = initialConvId ?? lsGet<string | null>(LS_ACTIVE, null);
    if (!activeTargetId) return false;
    return lsGet<StoredMessage[]>(lsMsgKey(activeTargetId), []).length === 0;
  });
  const threadRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeId) ?? null;
  const isLoading  = activeConv?.messages.at(-1)?.streaming === true || historyLoading;

  // Write vizzy_chats on every conversation list change
  useEffect(() => {
    setStoredChats(conversations.map(chatToStored));
  }, [conversations, setStoredChats]);

  // Write vizzy_active_chat on every activeId change
  useEffect(() => {
    if (activeId) setStoredActiveId(activeId);
    else removeStoredActiveId();
  }, [activeId, setStoredActiveId, removeStoredActiveId]);

  // On mount: restore messages from localStorage, then sync from Supabase in background
  useEffect(() => {
    const targetId = initialConvId ?? storedActiveId;

    // Sync from Supabase in background
    fetchConversations(userId)
      .then(async summaries => {
        setConversations(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const fromDB = summaries
            .filter(s => !existingIds.has(s.conversation_id))
            .map(s => ({
              id: s.conversation_id, title: s.title,
              messages: [], messageCount: s.message_count, messagesLoaded: false,
              createdAt: new Date(s.created_at), updatedAt: new Date(s.updated_at),
            }));
          const updated = prev.map(c => {
            const db = summaries.find(s => s.conversation_id === c.id);
            return db ? { ...c, messageCount: db.message_count } : c;
          });
          return [...updated, ...fromDB];
        });

        // 3. If no localStorage cache for active conv, load from Supabase
        if (targetId) {
          const hasCached = lsGet<StoredMessage[]>(lsMsgKey(targetId), []).length > 0;
          if (!hasCached) {
            const raw = await fetchHistory(targetId).catch(() => []);
            const msgs: ChatMessage[] = raw.map(m => ({
              id: genId(), role: m.role === 'user' ? 'user' : 'ai' as const,
              text: m.content, displayText: m.content, streaming: false, timestamp: new Date(),
            }));
            setConversations(prev =>
              prev.map(c => c.id === targetId ? { ...c, messages: msgs, messagesLoaded: true } : c),
            );
            lsSet(lsMsgKey(targetId), msgs.map(msgToStored));
          }
        }
      })
      .catch(() => {})
      .finally(() => setInitialLoading(false));
  }, [userId, initialConvId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const patchConv = useCallback((convId: string, updater: (c: Conversation) => Conversation) => {
    setConversations(prev => prev.map(c => c.id === convId ? updater(c) : c));
  }, []);

  const patchMsg = useCallback((convId: string, msgId: string, patch: Partial<ChatMessage>) => {
    patchConv(convId, c => ({
      ...c, updatedAt: new Date(),
      messages: c.messages.map(m => m.id === msgId ? { ...m, ...patch } : m),
    }));
  }, [patchConv]);

  const handleNewChat = useCallback(() => {
    setActiveId(null); setComposerText(''); pushUrl('/');
  }, []);

  // Select conversation — vizzy_messages_{id} cache first, Supabase fallback
  const handleSelectConv = useCallback(async (id: string) => {
    setActiveId(id);
    pushUrl(`/c/${id}`);
    const conv = conversations.find(c => c.id === id);
    if (!conv?.messagesLoaded) {
      const cached = lsGet<StoredMessage[]>(lsMsgKey(id), []);
      if (cached.length > 0) {
        patchConv(id, c => ({ ...c, messages: cached.map(storedToMsg), messagesLoaded: true }));
        return;
      }
    }
    if (!conv || conv.messagesLoaded) return;
    setHistoryLoading(true);
    try {
      const raw = await fetchHistory(id);
      const loaded: ChatMessage[] = raw.map(m => ({
        id: genId(), role: m.role === 'user' ? 'user' : 'ai' as const,
        text: m.content, displayText: m.content, streaming: false, timestamp: new Date(),
      }));
      patchConv(id, c => ({ ...c, messages: loaded, messagesLoaded: true }));
      lsSet(lsMsgKey(id), loaded.map(msgToStored));
    } finally {
      setHistoryLoading(false);
    }
  }, [conversations, patchConv]);

  const handleDeleteConv = useCallback(async (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    lsRemove(lsMsgKey(id));
    if (activeId === id) { setActiveId(null); pushUrl('/'); }
    await deleteConversation(id);
  }, [activeId]);

  const lastDisplayText = activeConv?.messages.at(-1)?.displayText;
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeConv?.messages.length, lastDisplayText]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); handleNewChat(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNewChat]);

  // ─── Send ──────────────────────────────────────────────────────────────────

  const handleSend = useCallback(async (text: string, files?: File[]) => {
    if (!text.trim() && !files?.length) return;
    const uploadedFiles: UploadedFile[] = (files ?? []).map(f => ({ name: f.name, url: URL.createObjectURL(f), type: f.type }));

    let convId = activeId;
    if (!convId) {
      convId = newConvId();
      const newConv: Conversation = {
        id: convId, title: truncate(text || 'New chat'),
        messages: [], messageCount: 0, messagesLoaded: true,
        createdAt: new Date(), updatedAt: new Date(),
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveId(convId);
      pushUrl(`/c/${convId}`);
    }

    const userMsgId = genId();
    const aiMsgId   = genId();
    const userMsg: ChatMessage = {
      id: userMsgId, role: 'user', text, displayText: text, streaming: false,
      files: uploadedFiles.length > 0 ? uploadedFiles : undefined, timestamp: new Date(),
    };

    // Add user message and write vizzy_messages_{id} immediately
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const updated = {
        ...c,
        title: c.messages.length === 0 ? truncate(text) : c.title,
        updatedAt: new Date(), messageCount: c.messageCount + 1,
        messages: [...c.messages, userMsg],
      };
      saveMessages(convId!, updated.messages);
      return updated;
    }));

    const aiPlaceholder: ChatMessage = {
      id: aiMsgId, role: 'ai', text: '', displayText: '', streaming: true, imageLoading: false, timestamp: new Date(),
    };
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, messageCount: c.messageCount + 1, messages: [...c.messages, aiPlaceholder] } : c,
    ));

    try {
      const response = await sendChat({
        message: text,
        conversation_id: convId,
        user_id: userId,
        user_name: user?.user_metadata?.name ?? '',
        user_email: user?.email ?? '',
        user_avatar: user?.user_metadata?.avatar_url ?? '',
        image_count: imageCount,
      });
      const hasImages = response.intent === 'image' && response.image_urls?.length;
      const finalImages: GridImage[] | undefined = hasImages
        ? response.image_urls!.map((url, i) => ({ url, label: `result ${String(i + 1).padStart(2, '0')}`, thumb: THUMB_CYCLE[i % THUMB_CYCLE.length] }))
        : undefined;

      patchMsg(convId, aiMsgId, { imageLoading: false, images: finalImages, intent: response.intent, searchResults: response.search_results, displayText: '' });

      startTypewriter(
        response.text,
        (partial) => patchMsg(convId, aiMsgId, { displayText: partial }),
        () => {
          // AI done — write final messages to vizzy_messages_{id}
          patchConv(convId!, c => {
            const final = c.messages.map(m =>
              m.id === aiMsgId ? { ...m, text: response.text, displayText: response.text, streaming: false } : m,
            );
            saveMessages(convId!, final);
            return { ...c, messages: final };
          });
        },
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      patchMsg(convId, aiMsgId, { text: msg, displayText: msg, streaming: false, imageLoading: false, images: undefined, error: true });
    }
  }, [activeId, userId, user, patchMsg, patchConv]);

  // ─── Render ───────────────────────────────────────────────────────────────

  if (initialLoading) {
    return (
      <div className="vz-screen flex items-center justify-center bg-(--vz-bg-0)">
        <DotmSquare18 size={32} speed={1.2} />
      </div>
    );
  }

  if (!activeConv) {
    return (
      <Onboarding
        conversations={conversations}
        onSend={(t) => { setComposerText(''); handleSend(t); }}
        onSelectConv={handleSelectConv}
        onNewChat={handleNewChat}
        imageCount={imageCount}
        onImageCountChange={setImageCount}
      />
    );
  }

  const msgs = activeConv.messages;
  const startTime = activeConv.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="vz-screen flex relative">
      <Sidebar conversations={conversations} activeId={activeId} onSelect={handleSelectConv} onNewChat={handleNewChat} onDelete={handleDeleteConv} />

      <main className="flex-1 h-full flex flex-col bg-[var(--vz-bg-0)] relative min-w-0">
        <header className="flex items-center justify-between px-7 py-[14px] border-b border-[var(--vz-line)] shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-[var(--vz-font-display)] text-[14.5px] font-medium text-[var(--vz-fg-0)] tracking-[-0.005em] truncate">{activeConv.title}</span>
            <button className="shrink-0 w-[22px] h-[22px] grid place-items-center rounded-[6px] text-[var(--vz-fg-2)] hover:text-[var(--vz-fg-0)] hover:bg-[var(--vz-bg-2)] transition-colors border-none bg-transparent cursor-pointer">
              <IconChevronDown size={14} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button className="px-3 py-[6px] rounded-[8px] bg-[var(--vz-bg-2)] border border-[var(--vz-line-strong)] text-[var(--vz-fg-0)] text-[12.5px] font-medium hover:bg-[var(--vz-bg-3)] transition-colors cursor-pointer font-[var(--vz-font-body)]">Share</button>
            <button className="w-[30px] h-[30px] grid place-items-center rounded-[8px] bg-transparent border border-[var(--vz-line)] text-[var(--vz-fg-1)] hover:bg-[var(--vz-bg-2)] transition-colors cursor-pointer">
              <IconDots size={16} />
            </button>
          </div>
        </header>

        <div ref={threadRef} className="flex-1 overflow-auto">
          <div className="max-w-[820px] mx-auto px-8 pt-8 pb-6 flex flex-col gap-7">
            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-[var(--vz-line)]" />
              <span className="font-mono text-[10.5px] text-[var(--vz-fg-2)] uppercase tracking-[0.06em] whitespace-nowrap">
                {activeConv.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} &middot; {startTime}
              </span>
              <span className="flex-1 h-px bg-[var(--vz-line)]" />
            </div>

            {historyLoading && (
              <div className="flex items-center gap-2 py-4">
                <DotmSquare18 size={20} 
                dotSize={2} 
                opacityBase={0.1}
                opacityMid={0.4}
                opacityPeak={0.95}
                speed={1.2} />
                <span className="text-[13px] text-vz-fg-2">Loading conversation&hellip;</span>
              </div>
            )}

            {msgs.map((msg, idx) =>
              msg.role === 'user' ? (
                <MessageUser key={msg.id} files={msg.files}>{msg.text}</MessageUser>
              ) : (
                <MessageAi key={msg.id} streaming={msg.streaming}>
                  {msg.streaming && !msg.displayText ? (
                    <div className="flex items-center gap-2">
                     <DotmSquare18
      size={20}
      dotSize={2}
      speed={1.4}
      opacityBase={0.1}
      opacityMid={0.4}
      opacityPeak={0.95}
    />
                      <span className="text-[13px] text-vz-fg-2">Working on that&hellip;</span>
                    </div>
                  ) : (
                    <p className={`m-0 text-[14.5px] leading-[1.55] ${msg.error ? 'text-[oklch(0.65_0.18_25)]' : 'text-(--vz-fg-0)'}`}>
                      {msg.displayText || msg.text}
                      {msg.streaming && <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-vz-accent align-middle animate-[vzBlink_1s_step-end_infinite]" />}
                    </p>
                  )}
                  {msg.images && msg.images.length > 0 && (
                    <ImageGrid
                      caption={msg.imageLoading ? 'generating variations…' : `${msg.images.length} results · prompt v${Math.ceil((idx + 1) / 2)}`}
                      generating={msg.imageLoading} images={msg.images}
                      onImageClick={(img) => setExpandedImage(img)}
                    />
                  )}
                  {msg.searchResults && msg.searchResults.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="font-mono text-[10.5px] text-[var(--vz-fg-2)] uppercase tracking-[0.07em]">Sources</div>
                      {msg.searchResults.slice(0, 4).map((r, i) => (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex flex-col gap-0.5 p-3 rounded-[10px] bg-[var(--vz-bg-2)] border border-[var(--vz-line)] hover:border-[var(--vz-line-strong)] transition-colors no-underline group">
                          <span className="text-[13px] font-medium text-[var(--vz-fg-0)] group-hover:text-[var(--vz-accent)] transition-colors">{r.title}</span>
                          <span className="text-[11px] text-[var(--vz-fg-2)] font-mono truncate">{r.url}</span>
                          {r.content && <span className="text-[12px] text-[var(--vz-fg-1)] line-clamp-2 mt-0.5">{r.content}</span>}
                        </a>
                      ))}
                    </div>
                  )}
                </MessageAi>
              )
            )}
          </div>
        </div>

        <footer className="shrink-0 px-8 pb-[22px] bg-gradient-to-b from-transparent to-[var(--vz-bg-0)]">
          <div className="max-w-[820px] mx-auto">
            <Composer
              value={composerText} onChange={setComposerText}
              onSend={(text, files) => { setComposerText(''); handleSend(text, files); }}
              onVoiceResult={(t) => setComposerText(t)}
              placeholder="Ask a follow-up, or describe a new variation…"
              imageCount={imageCount} onImageCountChange={setImageCount}
              aspectRatio={aspectRatio} onAspectRatioChange={setAspectRatio}
              disabled={isLoading}
            />
          </div>
        </footer>
      </main>

      {expandedImage && <ImageResult image={expandedImage} onClose={() => setExpandedImage(null)} />}
    </div>
  );
};
