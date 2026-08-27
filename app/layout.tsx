import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { resolveMetadataOrigin } from '../lib/metadataOrigin';
import { MOTION_BOOTSTRAP_SCRIPT } from '../lib/motionBootstrap';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const metadataOrigin = resolveMetadataOrigin();
const socialImageUrl = new URL('og.png', metadataOrigin).href;

export const metadata: Metadata = {
  metadataBase: metadataOrigin,
  title: {
    default: 'AURA FILM ARCHIVE',
    template: '%s — AURA FILM ARCHIVE',
  },
  description: 'Cinema that never existed, preserved as if it did.',
  applicationName: 'AURA FILM ARCHIVE',
  authors: [{ name: 'AURA Studio' }],
  creator: 'AURA Studio',
  keywords: [
    'AI cinema',
    'film poster archive',
    'art direction',
    'generative design',
    'visual design portfolio',
  ],
  openGraph: {
    type: 'website',
    title: 'AURA FILM ARCHIVE',
    description: 'Cinema that never existed, preserved as if it did.',
    siteName: 'AURA FILM ARCHIVE',
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: 'AURA FILM ARCHIVE — Cinema that never existed',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURA FILM ARCHIVE',
    description: 'Cinema that never existed, preserved as if it did.',
    images: [socialImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: MOTION_BOOTSTRAP_SCRIPT,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
