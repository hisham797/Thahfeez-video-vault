import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Toaster } from './ui/toaster';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
            {children}
      </main>
      <Toaster />
    </div>
  );
}

export default AdminLayout;
