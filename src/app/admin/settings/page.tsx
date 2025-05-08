"use client";

import React, { useState, useEffect } from 'react';
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface Settings {
  _id?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  allowRegistrations: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    allowRegistrations: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch settings');
      }

      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      // Update settings with the response data
      setSettings(data.settings);

      toast({
        title: "Success",
        description: data.message || "Settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic configuration for your video platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="siteName" className="text-sm font-medium">Site Name</label>
                    <input
                      id="siteName"
                      name="siteName"
                      type="text"
                      value={settings.siteName}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md bg-background border border-border"
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="siteDescription" className="text-sm font-medium">Site Description</label>
                    <textarea
                      id="siteDescription"
                      name="siteDescription"
                      value={settings.siteDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-2 rounded-md bg-background border border-border"
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</label>
                    <input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md bg-background border border-border"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="allowRegistrations"
                      name="allowRegistrations"
                      type="checkbox"
                      checked={settings.allowRegistrations}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      disabled={saving}
                    />
                    <label htmlFor="allowRegistrations" className="text-sm font-medium">Allow New Registrations</label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Admin Email</div>
                  <div className="mt-1">shaz80170@gmail.com</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Platform Version</div>
                  <div className="mt-1">1.0.0</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                  <div className="mt-1">{settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Never'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
