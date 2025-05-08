import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  MessageCircle,
  Video, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: 'Registrations',
    href: '/admin/registrations',
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: <MessageCircle className="h-5 w-5" />
  },
  {
    title: 'Videos',
    href: '/admin/videos',
    icon: <Video className="h-5 w-5" />
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300 flex flex-col",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h2 className="text-xl font-bold">Admin Panel</h2>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-accent rounded-lg"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                {item.icon}
                {!collapsed && (
                  <span>{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer with Logout and Return to Site buttons */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => router.push('/')}
          >
            <Home className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Return to Site</span>}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
