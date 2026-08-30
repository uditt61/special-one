import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Caveat, Playfair_Display } from 'next/font/google';
import './globals.css';

const sansFont = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const handwrittenFont = Caveat({
  variable: '--font-handwritten',
  subsets: ['latin'],
  display: 'swap',
});

const serifFont = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SpecialOne — Personalized Romantic Digital Surprise',
  description: 'Create an intimate, interactive digital gift for your special someone. Filled with memories, voice notes, love letters, and heartfelt surprises.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'A Special Surprise For You ❤️',
    description: 'Someone created an interactive digital world just for you.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${handwrittenFont.variable} ${serifFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FFF5F6] text-[#4A1525] selection:bg-[#FFE4EA] selection:text-[#E11D48]">
        {children}
      </body>
    </html>
  );
}
