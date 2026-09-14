import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { Gift } from '@/types/gift';
import { saveGiftToStorage } from '@/lib/supabase';
import { generateSlug } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const slug = body.slug || generateSlug();
    const id = (body.id && body.id.length === 36) ? body.id : randomUUID();

    const fullGift: Gift = {
      ...body,
      id,
      slug,
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const res = await saveGiftToStorage(fullGift);

    if (res.error) {
      return NextResponse.json(
        { success: false, error: res.error, slug: res.slug },
        { status: 500 }
      );
    }

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
