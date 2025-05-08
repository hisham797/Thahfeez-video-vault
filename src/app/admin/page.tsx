
'use client'

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    if (!user?.isAdmin) {
      router.push('/login');
    } else {
      // Redirect to dashboard if user is admin
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  // Return null while redirecting
  return null;
}