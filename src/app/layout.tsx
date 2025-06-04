// app/layout.tsx
'use client';

import './globals.css';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { VideoProvider } from '@/contexts/VideoContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Your secure video management platform" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://vistavideovault.com" />
        <meta property="og:title" content="Vista Video Vault" />
        <meta property="og:description" content="Your secure video management platform" />
        <meta property="og:site_name" content="Vista Video Vault" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vista Video Vault" />
        <meta name="twitter:description" content="Your secure video management platform" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <VideoProvider>
                <Toaster />
                <Sonner />
                {children}
              </VideoProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
