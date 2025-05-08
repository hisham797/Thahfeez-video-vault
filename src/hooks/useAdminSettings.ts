import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface AdminSettings {
  _id?: string;
  type: 'admin';
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  allowRegistrations: boolean;
  maxUploadSize: number;
  allowedVideoFormats: string[];
  maxVideoDuration: number;
  enableComments: boolean;
  enableRatings: boolean;
  featuredVideosLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/settings');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch settings');
      }
      
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<AdminSettings>) => {
    if (!settings) {
      toast({
        title: "Error",
        description: "No settings loaded",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          ...newSettings,
          type: 'admin'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSettings(data.settings);
      
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refreshSettings: fetchSettings
  };
} 