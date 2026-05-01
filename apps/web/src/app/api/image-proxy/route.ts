import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOST = 'image.pollinations.ai';

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get('url');
  if (!rawUrl) return new NextResponse('Missing url', { status: 400 });

  // Only proxy Pollinations URLs — block anything else
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }
  if (parsed.hostname !== ALLOWED_HOST) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Stagger concurrent requests by seed so all 4 images don't hit Pollinations
  // at exactly the same moment.  seed=0→0ms, seed=1→200ms, seed=2→400ms, …
  const seed = parseInt(parsed.searchParams.get('seed') ?? '0', 10);
  if (seed > 0) await new Promise(r => setTimeout(r, seed * 200));

  try {
    const res = await fetch(rawUrl, {
      signal: AbortSignal.timeout(45_000),
      headers: { 'User-Agent': 'Vizzy/1.0' },
    });

    if (!res.ok) {
      return new NextResponse('Image generation failed', { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') ?? 'image/jpeg';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        // Cache for 24 h — Pollinations generates deterministically per seed+prompt
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (err) {
    const msg = err instanceof Error && err.name === 'TimeoutError'
      ? 'Pollinations timed out'
      : 'Failed to fetch image';
    return new NextResponse(msg, { status: 503 });
  }
}
