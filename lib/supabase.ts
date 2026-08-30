import { createClient } from '@supabase/supabase-js';
import { Gift } from '@/types/gift';
import { saveLocalGift, getLocalGift } from './utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Database record schema mapping
interface DbGiftRecord {
  id: string;
  slug: string;
  sender_name: string;
  recipient_name: string;
  opening_message: string;
  occasion: string;
  relationship: string;
  relationship_style: string;
  together_month?: string;
  together_year?: string;
  photos: any;
  reasons: string[];
  love_letter: string;
  wax_seal: string;
  sticker: string;
  voice_message_url?: string;
  voice_duration?: number;
  final_message?: string;
  final_question?: string;
  theme: string;
  music: string;
  template: string;
  created_at: string;
}

function mapToDbRecord(gift: Gift): DbGiftRecord {
  return {
    id: gift.id,
    slug: gift.slug,
    sender_name: gift.senderName,
    recipient_name: gift.recipientName,
    opening_message: gift.openingMessage,
    occasion: gift.occasion,
    relationship: gift.relationship,
    relationship_style: gift.relationshipStyle,
    together_month: gift.togetherMonth,
    together_year: gift.togetherYear,
    photos: gift.photos || [],
    reasons: gift.reasons || [],
    love_letter: gift.loveLetter,
    wax_seal: gift.waxSeal,
    sticker: gift.sticker,
    voice_message_url: gift.voiceMessageUrl,
    voice_duration: gift.voiceDuration,
    final_message: gift.finalMessage,
    final_question: gift.finalQuestion,
    theme: gift.theme,
    music: gift.music,
    template: gift.template || 'romantic',
    created_at: gift.createdAt || new Date().toISOString(),
  };
}

function mapFromDbRecord(record: DbGiftRecord): Gift {
  return {
    id: record.id,
    slug: record.slug,
    senderName: record.sender_name,
    recipientName: record.recipient_name,
    openingMessage: record.opening_message,
    occasion: record.occasion,
    relationship: record.relationship,
    relationshipStyle: record.relationship_style,
    togetherMonth: record.together_month,
    togetherYear: record.together_year,
    photos: Array.isArray(record.photos) ? record.photos : [],
    reasons: Array.isArray(record.reasons) ? record.reasons : [],
    loveLetter: record.love_letter,
    waxSeal: (record.wax_seal as any) || '❤️',
    sticker: (record.sticker as any) || '🥰',
    voiceMessageUrl: record.voice_message_url,
    voiceDuration: record.voice_duration,
    finalMessage: record.final_message,
    finalQuestion: record.final_question,
    theme: (record.theme as any) || 'blush',
    music: (record.music as any) || 'music-box',
    template: (record.template as any) || 'romantic',
    createdAt: record.created_at,
  };
}

// Save Gift to Supabase (with fallback to local storage)
export async function saveGiftToStorage(gift: Gift): Promise<{ success: boolean; slug: string; error?: string }> {
  try {
    // Always persist to local fallback store first for instant redundancy
    saveLocalGift(gift);

    if (supabase) {
      const record = mapToDbRecord(gift);
      const { error } = await supabase.from('gifts').insert([record]);
      if (error) {
        console.warn('Supabase insert warning (saved locally):', error.message);
      }
    }

    return { success: true, slug: gift.slug };
  } catch (err: any) {
    console.warn('Error saving gift:', err);
    // Draft/Gift is still saved in local storage
    return { success: true, slug: gift.slug };
  }
}

// Fetch Gift by Slug
export async function fetchGiftBySlug(slug: string): Promise<Gift | null> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return mapFromDbRecord(data as DbGiftRecord);
      }
    }

    // Check local storage fallback
    const local = getLocalGift(slug);
    if (local) return local;

    return null;
  } catch (err) {
    console.warn('Error fetching gift:', err);
    return getLocalGift(slug);
  }
}
