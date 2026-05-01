import dynamic from 'next/dynamic';

// ChatApp is entirely localStorage-driven — there is nothing meaningful for
// the server to render.  Skipping SSR eliminates the hydration mismatch that
// occurs when the server produces empty-state HTML and the client hydrates
// with data from localStorage.
const ChatApp = dynamic(
  () => import('../components/chat/ChatApp').then(m => m.ChatApp),
  { ssr: false },
);

export default function Home() {
  return <ChatApp />;
}
