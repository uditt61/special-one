'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Gift } from '@/types/gift';
import { fetchGiftBySlug } from '@/lib/supabase';
import { GiftExperience } from '@/components/gift/GiftExperience';
import BirthdayExperience from '@/components/gift/BirthdayExperience';
import { Button } from '@/components/ui/Button';
import { FloatingHearts } from '@/components/ui/FloatingHearts';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';

export default function GiftRecipientPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [gift, setGift] = useState<Gift | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGift() {
      if (!slug) return;
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchGiftBySlug(slug);
        if (result) {
          setGift(result);
        } else {
          // Attempt client fetch via API route as well
          const res = await fetch(`/api/gifts/${slug}`);
          if (res.ok) {
            const data = await res.json();
            if (data.gift) {
              setGift(data.gift);
            } else {
              setError('Gift not found');
            }
          } else {
            setError('Gift not found');
          }
        }
      } catch (err: any) {
        console.error('Error fetching gift:', err);
        setError('Unable to load surprise.');
      } finally {
        setIsLoading(false);
      }
    }

    loadGift();
  }, [slug]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFF5F6] text-[#4A1525] text-center">
        <FloatingHearts count={8} />
        <div className="relative z-10 space-y-4 max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-[#FF4D79] to-[#E11D48] text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30 animate-pulse-soft text-2xl">
            🎁
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-serif-romantic text-[#4A1525]">
              Unwrapping your surprise...
            </h2>
            <p className="text-xs text-[#834758]">
              Gathering your memories and sweetest words.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not Found or Error State
  if (error || !gift) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FFF5F6] text-[#4A1525] text-center">
        <FloatingHearts count={6} />
        <div className="relative z-10 bg-white/95 rounded-3xl p-8 max-w-sm mx-auto border border-[#FED7E2] shadow-xl space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#FFF0F3] text-[#FF4D79] flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-serif-romantic text-[#4A1525]">
              Surprise Not Found
            </h2>
            <p className="text-xs text-[#834758]">
              This gift link may have expired or is not yet created. You can create a new romantic surprise anytime!
            </p>
          </div>
          <Link href="/create" className="block w-full">
            <Button size="md" fullWidth>
              <Sparkles className="w-4 h-4 mr-1.5" /> Create a Gift Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (gift.template === 'birthday') {
    return <BirthdayExperience gift={gift} />;
  }

  return <GiftExperience gift={gift} />;
}
