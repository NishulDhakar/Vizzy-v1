import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:8001';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  try {
    const upstream = await fetch(
      `${BACKEND}/history/${encodeURIComponent(conversationId)}`,
      { signal: AbortSignal.timeout(10_000) },
    );
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ messages: [] }, { status: 200 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  try {
    const upstream = await fetch(
      `${BACKEND}/history/${encodeURIComponent(conversationId)}`,
      { method: 'DELETE', signal: AbortSignal.timeout(10_000) },
    );
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json({ cleared: conversationId }, { status: 200 });
  }
}
