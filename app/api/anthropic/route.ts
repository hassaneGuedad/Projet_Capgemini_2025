import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt, model, system } = await req.json();
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key missing' }, { status: 500 });
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || 'claude-3-5-sonnet-latest',
      max_tokens: 2048,
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: prompt }
      ]
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
} 