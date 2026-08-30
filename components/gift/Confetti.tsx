'use client';

import confetti from 'canvas-confetti';

export function fireRomanticConfetti() {
  if (typeof window === 'undefined') return;

  const count = 120;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#FF4D79', '#E11D48', '#FF85A2', '#FBBF24', '#F43F5E', '#FFFFFF'],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
