# ❤️ SpecialOne — Personalized Romantic Digital Surprise Gift

A romantic, emotional, mobile-first web experience where you create an intimate digital surprise for your special someone.

---

## ✨ Features

- **7-Step Creator Flow**:
  1. **The Basics**: Names, opening message, suggestion chips.
  2. **The Two of You**: Occasion, relationship type, dynamic vibes, anniversary date.
  3. **Your Photos**: Up to 8 photo uploads with client-side compression, captions, and responsive grid.
  4. **Your Words**: Up to 5 selected/custom reasons, 500-character handwritten love letter, custom wax seal (`❤️`, `💋`, `🌹`, `🔥`, `∞`), and cute sticker stamp.
  5. **Your Voice**: Browser `MediaRecorder` voice recording up to 45 seconds with live waveform visualization, playback, and re-recording.
  6. **Finishing Touches**: Theme mood picker (`Soft Blush`, `Warm Cream`, `Romantic Rose`), romantic audio melody synth, final message, and optional interactive question.
  7. **Review & Share**: Summary card with badges, live preview mode, instant slug generation, and shareable link via Clipboard / Web Share API.

- **Immersive 7-Scene Recipient Experience**:
  - 🎁 **Scene 1**: Floating 3D illustrated gift box with ribbon unwrapping & spark burst.
  - 💬 **Scene 2**: Emotional typing reveal of the opening message.
  - 📸 **Scene 3**: Polaroid-style scrapbook cards with authentic tilts, zooms, and captions.
  - ✨ **Scene 4**: Paced unfolding reasons why you love them.
  - 🎙️ **Scene 5**: Wax-sealed voice note player with animated sound wave bars.
  - 💌 **Scene 6**: Wax-sealed envelope with interactive unsealing and unfolded handwritten love letter.
  - 🎆 **Scene 7**: Climax moment, floating hearts, interactive question with romantic confetti explosion!

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Animations**: Framer Motion, Canvas Confetti, CSS keyframes
- **Audio**: Web Audio API Synthesizer (synthesized music box & harp lullaby loop) + browser MediaRecorder API
- **Database & Storage**: Supabase PostgreSQL with RLS & graceful local storage fallback
- **Icons**: Lucide React

---

## 🚀 Getting Started Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
*(Note: If no Supabase credentials are provided, SpecialOne seamlessly falls back to browser local storage so you can test all features offline and immediately!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup

Run the SQL script located at `supabase/schema.sql` in your Supabase SQL Editor to set up:
- The `gifts` table
- Indexes on `slug`
- Row Level Security (RLS) policies for public insert and select
- Storage bucket policies for `gift-assets`

---

## 📱 Responsive Testing

Tested and optimized for mobile viewports:
- `360 × 800`
- `375 × 812` (iPhone SE / X)
- `390 × 844` (iPhone 12/13/14)
- `414 × 896` (iPhone Plus / Max)
- `768px` (iPad / Tablet)
- `1024px+` (Desktop centered mobile-frame layout)

---

## 📄 Architecture Overview

```
├── app/
│   ├── api/gifts/          # REST API for creating and fetching gifts
│   ├── create/             # 7-Step Creator wizard page
│   ├── gift/[slug]/        # Recipient dynamic surprise page
│   ├── preview/            # Creator preview page
│   ├── globals.css         # Romantic tokens, theme classes, animations
│   ├── layout.tsx          # Google fonts (Plus Jakarta Sans, Caveat, Playfair Display)
│   └── page.tsx            # Romantic landing page
├── components/
│   ├── creator/            # Wizard steps (1 to 7)
│   ├── gift/               # Recipient scenes (1 to 7) & confetti
│   └── ui/                 # Reusable buttons, cards, floating hearts, ambient sound
├── lib/
│   ├── supabase.ts         # Supabase client & fallback persistence
│   ├── utils.ts            # Web Audio synth, compression, slug generation
│   └── validation.ts       # Step-by-step form validation
├── supabase/
│   └── schema.sql          # PostgreSQL database schema & RLS
└── types/
    └── gift.ts             # Central Gift data model
```
