import { NextRequest, NextResponse } from 'next/server';
import { Gift } from '@/types/gift';
import { saveGiftToStorage } from '@/lib/supabase';
import { generateSlug } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const slug = body.slug || generateSlug();
    const id = body.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2));

    const fullGift: Gift = {
      ...body,
      id,
      slug,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const res = await saveGiftToStorage(fullGift);

    return NextResponse.json({
      success: true,
      slug: res.slug,
      gift: fullGift,
    });
  } catch (error: any) {
    console.error('API /api/gifts error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save gift' },
      { status: 500 }
    );
  }
}
