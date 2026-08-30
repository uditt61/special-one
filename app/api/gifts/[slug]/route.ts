import { NextRequest, NextResponse } from 'next/server';
import { fetchGiftBySlug } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const gift = await fetchGiftBySlug(slug);
    if (!gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    return NextResponse.json({ gift });
  } catch (error: any) {
    console.error('API /api/gifts/[slug] error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
