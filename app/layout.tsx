import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happy Birthday, Rayta! ✨',
  description:
    'A special birthday experience crafted with love — blow out the candle, explore the hallway, and hear messages from your friends.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* CRT scanline overlay — always visible */}
        <div className="crt-overlay" />
      </body>
    </html>
  );
}
