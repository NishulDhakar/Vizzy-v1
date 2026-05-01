// ─── User identity ─────────────────────────────────────────────────────────────
// Generates a persistent anonymous user ID stored in localStorage.
export function getUserId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('vizzy_user_id');
  if (!id) {
    id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('vizzy_user_id', id);
  }
  return id;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ChatPayload {
  message: string;
  user_id?: string;
  conversation_id?: string;
  user_name?: string;
  user_email?: string;
  user_avatar?: string;
  image_count?: number;
}

export interface SearchResult {
  title: string;
  url: string;
  content: string;
}

export interface ChatAPIResponse {
  text: string;
  intent: 'chat' | 'image' | 'search';
  image_urls?: string[];
  search_results?: SearchResult[];
  error?: string;
}

export interface VoiceAPIResponse {
  text: string;
}

export interface ConversationSummary {
  conversation_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── API calls ─────────────────────────────────────────────────────────────────

export async function sendChat(payload: ChatPayload): Promise<ChatAPIResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data as ChatAPIResponse;
}

export async function fetchConversations(userId: string): Promise<ConversationSummary[]> {
  if (!userId) return [];
  const res = await fetch(`/api/conversations/${encodeURIComponent(userId)}`);
  const data = await res.json().catch(() => ({ conversations: [] }));
  return (data.conversations ?? []) as ConversationSummary[];
}

export async function fetchHistory(conversationId: string): Promise<HistoryMessage[]> {
  const res = await fetch(`/api/history/${encodeURIComponent(conversationId)}`);
  const data = await res.json().catch(() => ({ messages: [] }));
  return (data.messages ?? []) as HistoryMessage[];
}

export async function deleteConversation(conversationId: string): Promise<void> {
  await fetch(`/api/history/${encodeURIComponent(conversationId)}`, { method: 'DELETE' });
}

export async function transcribeVoice(audioBlob: Blob): Promise<VoiceAPIResponse> {
  const form = new FormData();
  form.append('audio', audioBlob, 'recording.webm');
  const res = await fetch('/api/voice', { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Transcription failed: ${res.status}`);
  return data as VoiceAPIResponse;
}
