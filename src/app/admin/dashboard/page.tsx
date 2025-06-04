'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Calendar, MessageSquare, Video, CalendarClock, Settings, Mail, GalleryHorizontal } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { ActionCard } from '@/components/ui/action-card';
import { RegistrationTable } from '@/components/RegistrationTable';
import { RegistrationStats } from '@/components/RegistrationStats';
import { AdminLayout } from '@/components/AdminLayout';
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface DashboardStats {
  registrations: {
    total: number;
    accepted: number;
    pending: number;
    rejected: number;
    today: number;
  };
  messages: {
    total: number;
    unread: number;
  };
  videos: {
    total: number;
    featured: number;
  };
  recentRegistrations: Array<{
    _id: string;
    name: string;
    email: string;
    organization: string;
    status: 'approved' | 'pending' | 'rejected';
    createdAt: string;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/login');
    } else {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard stats');
      }

      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard stats');
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="text-red-500 p-4">
          Error loading dashboard: {error}
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="p-6 md:p-8 w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Welcome back, <span className="text-indigo-400">{user?.fullName || 'Admin'}</span></h2>
          <p className="text-gray-400 mt-1">Here's what's happening with your seminar.</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard 
            icon={<Users size={20} />}
            title="Registrations"
            value={stats.registrations.total.toString()}
            subtitle={`+ ${stats.registrations.today} today`}
          />
          
          <StatCard 
            icon={<MessageSquare size={20} />}
            title="Messages"
            value={stats.messages.total.toString()}
            subtitle={`${stats.messages.unread} unread`}
          />
          <StatCard 
            icon={<GalleryHorizontal size={20} />}
            title="Videos"
            value={stats.videos.total.toString()}
            subtitle={`${stats.videos.featured} featured`}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Users size={18} className="text-indigo-400" />
                <h2 className="text-lg font-medium text-white">Recent Registrations</h2>
                <span className="text-xs text-gray-400">Latest registrations for the seminar</span>
              </div>
              <Button variant="link" className="text-indigo-400 hover:text-indigo-300 p-0" asChild>
                <Link href="/admin/registrations">View All →</Link>
              </Button>
            </div>
            
            <RegistrationTable 
              registrations={stats.recentRegistrations}
              showingText={`Showing ${stats.recentRegistrations.length} of ${stats.registrations.total} total registrations`}
            />
          </div>
          
          <div>
            <RegistrationStats 
              totalRegistrations={stats.registrations.total}
              acceptedRegistrations={stats.registrations.accepted}
              pendingRegistrations={stats.registrations.pending}
              rejectedRegistrations={stats.registrations.rejected}
              todayRegistrations={stats.registrations.today}
            />
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="text-yellow-500">⚡</div>
            <h2 className="text-lg font-medium text-white">Quick Actions</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/videos">
            <ActionCard 
              icon={<Video size={24} className="text-indigo-400" />}
              title="Create Video"
              description="Add a new video to the seminar"
            />
          </Link>
          <Link href="/admin/registrations">
            <ActionCard 
              icon={<Users size={24} className="text-green-500" />}
              title="Manage Registrations"
              description="View and manage participant registrations"
            />
          </Link>
          <Link href="/admin/messages">
            <ActionCard 
              icon={<Mail size={24} className="text-blue-400" />}
              title="View Messages"
              description="Check gallery and contact messages"
            />
          </Link>
          <Link href="/admin/settings">
            <ActionCard 
              icon={<Settings size={24} className="text-gray-400" />}
              title="Settings"
              description="Configure seminar settings"
            />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
