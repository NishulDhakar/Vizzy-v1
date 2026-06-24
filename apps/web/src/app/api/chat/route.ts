import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${BACKEND}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });
    const data = await upstream.json().catch(() => ({}));
    // Always forward the backend response — even on 5xx.
    // The backend now returns a safe fallback JSON body instead of crashing,
    // so the frontend receives a readable error message rather than an empty 500.
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    const message = err instanceof Error && err.name === 'TimeoutError'
      ? 'Request timed out — backend took too long to respond.'
      : 'Backend unavailable.';
    return NextResponse.json({ text: message, intent: 'chat', image_urls: [], search_results: [], error: message }, { status: 503 });
  }
}
