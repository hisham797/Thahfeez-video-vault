import { useState, useEffect } from 'react';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  allowRegistrations: boolean;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch settings');
        }

        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
} 