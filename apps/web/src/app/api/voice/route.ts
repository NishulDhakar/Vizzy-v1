import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const upstream = await fetch(`${BACKEND}/voice`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(30_000),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { error: 'Voice transcription unavailable.' },
      { status: 503 }
    );
  }
}
