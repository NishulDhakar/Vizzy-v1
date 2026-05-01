'use client';

import dynamic from 'next/dynamic';

const ChatApp = dynamic(
  () => import('./ChatApp').then((m) => m.ChatApp),
  { ssr: false },
);

export default function ClientChatApp() {
  return <ChatApp />;
}
