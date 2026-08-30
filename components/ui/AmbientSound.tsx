'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { RomanticAudioSynth } from '@/lib/utils';

interface AmbientSoundProps {
  initialPlay?: boolean;
  enabled?: boolean;
}

export const AmbientSound: React.FC<AmbientSoundProps> = ({ initialPlay = false, enabled = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<RomanticAudioSynth | null>(null);

  useEffect(() => {
    synthRef.current = new RomanticAudioSynth();
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  if (!enabled) return null;

  const handleToggle = () => {
    if (!synthRef.current) return;
    const active = synthRef.current.toggle();
    setIsPlaying(active);
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      aria-label={isPlaying ? 'Mute ambient melody' : 'Play romantic ambient music box melody'}
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md border border-[#FED7E2] rounded-full shadow-lg text-[#4A1525] text-xs font-medium hover:border-[#FF4D79] transition-all cursor-pointer"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-[#FF4D79] animate-pulse" />
          <span className="hidden sm:inline text-[#B81846]">Music playing</span>
          <span className="flex items-end gap-0.5 h-3">
            <span className="w-1 bg-[#FF4D79] rounded-full animate-[bounce_0.8s_infinite_100ms] h-2" />
            <span className="w-1 bg-[#FF4D79] rounded-full animate-[bounce_0.8s_infinite_300ms] h-3" />
            <span className="w-1 bg-[#FF4D79] rounded-full animate-[bounce_0.8s_infinite_200ms] h-1.5" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-[#834758]" />
          <span className="hidden sm:inline text-[#834758]">Romantic Melody</span>
          <Sparkles className="w-3 h-3 text-[#F59E0B]" />
        </>
      )}
    </motion.button>
  );
};
