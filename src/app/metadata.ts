import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thahfeez-video-va',
  description: 'Learn the quran anywhere anytime',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/apple-icon.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
      },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#4F46E5',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vistavideovault.com',
    title: 'Thahfeez-video-vault',
    description: 'Learn the quran anywhere anytime',
    siteName: 'Thahfeez-video-vault',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thahfeez-video-va',
    description: 'Learn the quran anywhere anytime',
  },
} 