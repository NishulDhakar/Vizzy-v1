import { ChatApp } from '@/components/chat/ChatApp';

export default async function ConvPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatApp initialConvId={id} />;
}
