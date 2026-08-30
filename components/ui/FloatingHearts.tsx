'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  symbol: string;
  opacity: number;
}

export const FloatingHearts: React.FC<{ count?: number }> = ({ count = 14 }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const symbols = ['❤️', '✨', '🌸', '💖', '💕', '🌷', '✨'];
    const generated: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 92 + 4, // 4% to 96%
      y: Math.random() * 100,
      size: Math.floor(Math.random() * 12) + 14,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 5,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      opacity: Math.random() * 0.4 + 0.2,
    }));
    setParticles(generated);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '110vh', x: `${p.x}vw`, opacity: 0, scale: 0.6 }}
          animate={{
            y: '-10vh',
            x: [`${p.x}vw`, `${p.x + (p.id % 2 === 0 ? 3 : -3)}vw`, `${p.x}vw`],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [0.6, 1, 0.9, 0.5],
            rotate: [0, p.id % 2 === 0 ? 20 : -20, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
          className="absolute select-none"
          style={{ fontSize: `${p.size}px` }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
};
