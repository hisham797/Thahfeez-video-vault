'use client';

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function EventRegistrationStep2() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    // Get stored form data from step 1
    const storedData = localStorage.getItem('eventRegistrationData');
    if (!storedData) {
      router.push('/event-registration');
      return;
    }
    setFormData(JSON.parse(storedData));
  }, [router]);

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare registration data
      const registrationData = {
        ...formData,
        password: data.password,
        createdAt: new Date(),
        status: 'pending',
        ticketType: 'standard',
        role: 'user'
      };

      // Submit registration
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        ...formData,
        role: 'user',
        isRegistered: true
      }));

      // Clean up stored form data
      localStorage.removeItem('eventRegistrationData');

      toast({
        title: "Registration Successful!",
        description: "Welcome to Vista Video Vault. You're now registered!",
      });

      router.push('/registration-success');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to submit registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">
              Complete your registration by creating a password
            </p>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Create Password</CardTitle>
              <CardDescription>
                Choose a strong password to secure your account
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Choose a strong password"
                    required
                    minLength={8}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="rounded-lg bg-primary/10 p-4">
                  <h3 className="font-medium mb-2">Registration Summary</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Event Type:</strong> {formData.eventType}</p>
                    <p><strong>Attendees:</strong> {formData.attendees}</p>
                    {formData.specialRequirements && (
                      <p><strong>Special Requirements:</strong> {formData.specialRequirements}</p>
                    )}
                    {formData.dietaryRestrictions && (
                      <p><strong>Dietary Restrictions:</strong> {formData.dietaryRestrictions}</p>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/event-registration')}
                >
                  Back
                </Button>

                <Button
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing Registration...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 