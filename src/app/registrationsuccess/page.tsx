"use client";

import { useEffect, useState } from 'react';
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface Registration {
  eventType: string;
  status: string;
}

export default function RegistrationSuccess() {
  const router = useRouter();
  const { user } = useAuth();
  const [registration, setRegistration] = useState<Registration | null>(null);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch registration details
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`/api/registrations/${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setRegistration(data);
        }
      } catch (error) {
        console.error('Error fetching registration:', error);
      }
    };

    fetchRegistration();
  }, [user, router]);

  if (!user) {
    return null; // Don't render anything while checking auth
  }
  
  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Registration Complete!</CardTitle>
                  <CardDescription>
                    Welcome to Vista Video Vault
                  </CardDescription>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Check className="h-6 w-6" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-primary/10 p-4">
                <h3 className="font-medium mb-2">Welcome, {user.fullName}!</h3>
                <p className="mb-4">Your registration is complete and you're now logged in. You can access all features of Vista Video Vault.</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> {user.email}</p>
                  {registration && (
                    <>
                      <p><strong>Event Type:</strong> {registration.eventType}</p>
                      <p><strong>Status:</strong> {registration.status}</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/">Return Home</Link>
              </Button>
              <Button asChild>
                <Link href="/videos">Watch Videos Now</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
