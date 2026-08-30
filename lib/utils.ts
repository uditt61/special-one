import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Gift, GiftDraft } from '@/types/gift';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate unpredictable, aesthetic 6-character slug (e.g. "k8m2px")
export function generateSlug(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const DRAFT_KEY = 'special_one_gift_draft_v1';
const LOCAL_GIFTS_KEY = 'special_one_saved_gifts_v1';

export const defaultGiftDraft: Gift = {
  id: '',
  slug: '',
  senderName: '',
  recipientName: '',
  openingMessage: 'I made something for you.',
  occasion: 'Just because',
  relationship: 'My partner',
  relationshipStyle: 'Soft & quiet',
  togetherMonth: 'June',
  togetherYear: '2023',
  photos: [],
  reasons: [
    'You make ordinary days feel special.',
    'You feel like home.',
    'The way you laugh at your own jokes.',
  ],
  loveLetter: `I wanted to give you a little reminder of how much you mean to me.\n\nEvery day with you is my favourite place to be, and I am so grateful for all our laughs, quiet moments, and adventures together.\n\nAlways yours.`,
  waxSeal: '❤️',
  sticker: '🥰',
  theme: 'blush',
  music: 'music-box',
  finalMessage: "I'd choose you in every lifetime.",
  finalQuestion: 'Will you always be my person?',
  template: 'romantic',
  createdAt: new Date().toISOString(),
};

// Local storage draft helpers
export function saveDraft(draft: GiftDraft): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    console.warn('Unable to persist draft to localStorage:', err);
  }
}

export function loadDraft(): GiftDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Unable to parse draft from localStorage:', err);
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    console.warn('Unable to clear draft:', err);
  }
}

// Local storage fallback for saved gifts (so the app works seamlessly even without Supabase credentials configured)
export function saveLocalGift(gift: Gift): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LOCAL_GIFTS_KEY);
    const gifts: Record<string, Gift> = raw ? JSON.parse(raw) : {};
    gifts[gift.slug] = gift;
    localStorage.setItem(LOCAL_GIFTS_KEY, JSON.stringify(gifts));
  } catch (err) {
    console.warn('Error saving local gift:', err);
  }
}

export function getLocalGift(slug: string): Gift | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_GIFTS_KEY);
    if (!raw) return null;
    const gifts: Record<string, Gift> = JSON.parse(raw);
    return gifts[slug] || null;
  } catch (err) {
    console.warn('Error reading local gift:', err);
    return null;
  }
}

// Client-side image compressor: scales down large images to max 1200px and outputs high-quality WebP/JPEG dataURL
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let { width, height } = img;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Romantic Web Audio Synthesizer (Music Box & Harp Lullaby)
// Creates an enchanting, gentle ambient acoustic melody loop without requiring external files
export class RomanticAudioSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: NodeJS.Timeout | null = null;
  private noteIndex = 0;

  // Romantic Pentatonic/Diatonic melody notes (Frequencies in Hz)
  private melody = [
    // Canon in D / Romantic Music Box Melody
    { f: 523.25, d: 0.6 }, // C5
    { f: 659.25, d: 0.6 }, // E5
    { f: 783.99, d: 0.6 }, // G5
    { f: 1046.5, d: 1.0 }, // C6
    { f: 987.77, d: 0.6 }, // B5
    { f: 783.99, d: 0.6 }, // G5
    { f: 880.0, d: 0.8 },  // A5
    { f: 659.25, d: 0.8 }, // E5
    { f: 698.46, d: 0.6 }, // F5
    { f: 783.99, d: 0.6 }, // G5
    { f: 880.0, d: 0.8 },  // A5
    { f: 523.25, d: 1.0 }, // C5
    { f: 587.33, d: 0.6 }, // D5
    { f: 659.25, d: 0.6 }, // E5
    { f: 783.99, d: 0.8 }, // G5
    { f: 523.25, d: 1.2 }, // C5
  ];

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.isPlaying = true;
      this.noteIndex = 0;
      this.playNextNote();
    } catch (e) {
      console.warn('AudioContext not allowed or failed:', e);
    }
  }

  private playNextNote() {
    if (!this.isPlaying || !this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const note = this.melody[this.noteIndex];
    const now = this.ctx.currentTime;

    // Create warm music box chime with pleasant harmonics
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(note.f, now);

    // Subtle octave shimmer
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(note.f * 2, now);

    // Warm bell envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.d * 1.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + note.d * 1.6);
    osc2.stop(now + note.d * 1.6);

    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    this.timer = setTimeout(() => {
      this.playNextNote();
    }, note.d * 1000 + 150);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

// Satisfying Balloon Pop Sound Synthesizer using Web Audio API
export function playPopSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Pop Oscillator (Pitch drop sweep)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);

    // Short pop noise click
    const bufferSize = ctx.sampleRate * 0.03;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.035);
  } catch (e) {
    console.warn('Audio pop sound error:', e);
  }
}

// Gentle Candle Blowing Sound Synthesizer using Web Audio API
export function playCandleBlowSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.5);
  } catch (e) {
    console.warn('Audio blow sound error:', e);
  }
}
