'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gift } from '@/types/gift';
import { defaultGiftDraft, loadDraft } from '@/lib/utils';
import { GiftExperience } from '@/components/gift/GiftExperience';

export default function PreviewPage() {
  const [gift, setGift] = useState<Gift>(defaultGiftDraft);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setGift((prev) => ({
        ...prev,
        ...draft,
        id: 'preview',
        slug: 'preview',
        senderName: draft.senderName || 'Your Name',
        recipientName: draft.recipientName || 'Recipient Name',
        openingMessage: draft.openingMessage || 'I made something for you.',
        reasons: draft.reasons && draft.reasons.length > 0 ? draft.reasons : prev.reasons,
        loveLetter: draft.loveLetter || prev.loveLetter,
        photos: draft.photos || [],
      }));
    }
  }, []);

  return (
    <GiftExperience
      gift={gift}
      isPreview={true}
      onExitPreview={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/create';
        }
      }}
    />
  );
}
