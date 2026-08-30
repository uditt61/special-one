export interface Photo {
  id: string;
  url: string;
  caption?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export type ThemeMood = 'blush' | 'cream' | 'rose';
export type MusicOption = 'music-box' | 'harp-lullaby' | 'none';
export type WaxSeal = '❤️' | '💋' | '🌹' | '🔥' | '∞';
export type Sticker = '🥰' | '😘' | '🥹' | '😍' | '🧸';

export interface Gift {
  id: string;
  slug: string;

  // Step 1 - The Basics
  senderName: string;
  recipientName: string;
  openingMessage: string;

  // Step 2 - The Two of You
  occasion: string;
  relationship: string;
  relationshipStyle: string;
  togetherMonth?: string;
  togetherYear?: string;

  // Birthday Specific (Optional)
  turningAge?: string;
  birthDay?: string;
  birthMonth?: string;

  // Step 3 - Photos
  photos: Photo[];

  // Step 4 - Words & Love Letter
  reasons: string[];
  loveLetter: string;
  waxSeal: WaxSeal;
  sticker: Sticker;

  // Step 5 - Voice Message
  voiceMessageUrl?: string;
  voiceDuration?: number;

  // Step 6 - Finishing Touches
  theme: ThemeMood;
  music: MusicOption;
  finalMessage?: string;
  finalQuestion?: string;

  // Template / Metadata (Ready for future expansion)
  template: 'romantic' | 'birthday' | 'friendship' | 'anniversary';
  createdAt: string;
  updatedAt?: string;
}

export type GiftDraft = Partial<Gift>;
