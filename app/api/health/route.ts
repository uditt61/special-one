import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    url && 
    key && 
    url.startsWith('http') &&
    !url.includes('your-project')
  );

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    isSupabaseConfigured: isConfigured,
    hasUrl: Boolean(url),
    urlDomain: url ? new URL(url).hostname : null,
    hasKey: Boolean(key),
    keyPrefix: key ? key.substring(0, 15) + '...' : null,
  });
}
