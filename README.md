This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'eventType', 'attendees', 'password'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('thahfeez');

    // Check if user is already registered
    const existingRegistration = await db.collection('registrations').findOne({ email: data.email });
    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You have already registered for an event' },
        { status: 400 }
      );
    }

    // Insert into registrations collection
    const registrationResult = await db.collection('registrations').insertOne({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || "Not Provided",
      eventType: data.eventType,
      attendees: data.attendees,
      specialRequirements: data.specialRequirements,
      dietaryRestrictions: data.dietaryRestrictions,
      subscribe: data.subscribe,
      referral: data.referral,
      date: new Date().toISOString(),
      organization: "Not Specified",
      createdAt: new Date(),
      status: 'pending',
      ticketType: data.eventType === 'conference' ? 'Full Access' : 'VIP Access',
    });

    // Insert into asma collection
    const asmaResult = await db.collection('asma').insertOne({
      name: data.fullName,
      email: data.email,
      password: data.password, // Note: In a production environment, this should be hashed
      createdAt: new Date(),
      role: 'user',
      isActive: true
    });

    return NextResponse.json(
      { 
        message: 'Registration successful', 
        registrationId: registrationResult.insertedId,
        asmaId: asmaResult.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving registration:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
} 



'use client'
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CalendarCheck, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller, FieldValues, Control } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface EventRegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  attendees: string;
  specialRequirements: string;
  dietaryRestrictions: string;
  subscribe: boolean;
  referral: string;
}

interface EventRegistration {
  name: string;
  email: string;
  eventType: string;
  attendees: string;
  date: string;
  organization: string;
  phone: string;
  ticketType: string;
  status: string;
}

interface FormFieldProps {
  field: {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
}

export default function EventRegistration() {
  const { register, login, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const router = useRouter();
  
  // Check if the user is already registered for an event
  useEffect(() => {
    if (user?.email) {
      const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]') as EventRegistration[];
      if (registrations.some(reg => reg.email === user.email)) {
        setIsAlreadyRegistered(true);
      }
    }
  }, [user]);
  
  const { control, handleSubmit, watch, formState: { errors } } = useForm<EventRegistrationFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      eventType: "webinar",
      attendees: "1",
      specialRequirements: "",
      dietaryRestrictions: "none",
      subscribe: true,
      referral: "",
    }
  });
  
  const onSubmit = async (data: EventRegistrationFormData) => {
    try {
      setIsSubmitting(true);
      
      if (step === 1) {
        setStep(2);
        return;
      }
      
      // Split name into first and last
      const nameParts = data.fullName.trim().split(" ");
      const name = nameParts.length > 1 ? data.fullName : data.fullName + " User";
      
      // Register the user
      const success = await register(name, data.email, password);
      
      if (success) {
        // Save registration data to MongoDB
        const response = await fetch('/api/registrations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone || "Not Provided",
            eventType: data.eventType,
            attendees: data.attendees,
            specialRequirements: data.specialRequirements,
            dietaryRestrictions: data.dietaryRestrictions,
            subscribe: data.subscribe,
            referral: data.referral,
            date: new Date().toISOString(),
            organization: "Not Specified",
            password: password
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to save registration');
        }
        
        // Show success message
        toast({ 
          title: "Registration successful!",
          description: "You've been registered for the event and an account has been created.",
        });
        
        // Navigate to success page
        router.push("/registrationsuccess");
      }
    } catch (error) {
      toast({ 
        title: "Registration failed",
        description: error instanceof Error ? error.message : "There was a problem with your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If the user is already registered, show a different UI
  if (isAlreadyRegistered) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Already Registered</CardTitle>
                    <CardDescription>
                      You've already registered for an event
                    </CardDescription>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check className="h-6 w-6" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-lg font-medium mb-4">Thank you for registering!</p>
                  <p className="mb-6">Your event registration has been confirmed. You can now access all event materials and videos.</p>
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
  
  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Event Registration</h1>
            <p className="text-muted-foreground">
              Join our upcoming educational events and workshops
            </p>
          </div>
          
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {step === 1 ? "Event Details" : "Create Account"}
                  </CardTitle>
                  <CardDescription>
                    {step === 1 
                      ? "Please fill in your information to register" 
                      : "Create an account to complete your registration"
                    }
                  </CardDescription>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CalendarCheck />
                </div>
              </div>
            </CardHeader>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                {step === 1 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Controller
                          name="fullName"
                          control={control}
                          rules={{ required: "Name is required" }}
                          render={({ field }: { field: FormFieldProps['field'] }) => (
                            <Input 
                              id="fullName" 
                              placeholder="John Doe"
                              {...field}
                            />
                          )}
                        />
                        {errors.fullName && (
                          <p className="text-sm text-red-500">{errors.fullName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Controller
                          name="email"
                          control={control}
                          rules={{ 
                            required: "Email is required",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Invalid email address"
                            }
                          }}
                          render={({ field }: { field: FormFieldProps['field'] }) => (
                            <Input 
                              id="email" 
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                            />
                          )}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Controller
                          name="phone"
                          control={control}
                          rules={{
                            pattern: {
                              value: /^\+?[\d\s-()]+$/,
                              message: "Invalid phone number"
                            }
                          }}
                          render={({ field }: { field: FormFieldProps['field'] }) => (
                            <Input 
                              id="phone" 
                              placeholder="+1 (555) 123-4567"
                              {...field}
                            />
                          )}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="eventType">Event Type</Label>
                        <Controller
                          name="eventType"
                          control={control}
                          rules={{ required: "Event type is required" }}
                          render={({ field }: { field: FormFieldProps['field'] }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select event type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="webinar">Online Webinar</SelectItem>
                                <SelectItem value="workshop">Hands-on Workshop</SelectItem>
                                <SelectItem value="conference">Full Conference</SelectItem>
                                <SelectItem value="course">Multi-day Course</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.eventType && (
                          <p className="text-sm text-red-500">{errors.eventType.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="attendees">Number of Attendees</Label>
                        <Controller
                          name="attendees"
                          control={control}
                          rules={{ required: "Number of attendees is required" }}
                          render={({ field }: { field: FormFieldProps['field'] }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select number of attendees" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Just me (1)</SelectItem>
                                <SelectItem value="2">2 people</SelectItem>
                                <SelectItem value="3-5">3-5 people</SelectItem>
                                <SelectItem value="6+">6+ people</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.attendees && (
                          <p className="text-sm text-red-500">{errors.attendees.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                        <Controller
                          name="dietaryRestrictions"
                          control={control}
                          rules={{ required: "Dietary restrictions selection is required" }}
                          render={({ field }: { field: FormFieldProps['field'] }) => (
                            <RadioGroup 
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="none" id="none" />
                                <Label htmlFor="none">None</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="vegetarian" id="vegetarian" />
                                <Label htmlFor="vegetarian">Vegetarian</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="vegan" id="vegan" />
                                <Label htmlFor="vegan">Vegan</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" />
                                <Label htmlFor="other">Other</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                        {errors.dietaryRestrictions && (
                          <p className="text-sm text-red-500">{errors.dietaryRestrictions.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">
                        Special Requirements or Accessibility Needs
                      </Label>
                      <Controller
                        name="specialRequirements"
                        control={control}
                        render={({ field }: { field: FormFieldProps['field'] }) => (
                          <Textarea 
                            id="specialRequirements"
                            placeholder="Let us know if you have any special requirements"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="subscribe"
                        control={control}
                        render={({ field }: { field: FormFieldProps['field'] }) => (
                          <Switch
                            id="subscribe"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor="subscribe">
                        Send me updates about future events and resources
                      </Label>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="create-password">Create Password</Label>
                      <Input
                        id="create-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Choose a strong password"
                        required
                        minLength={8}
                      />
                    </div>
                    
                    <div className="rounded-lg bg-primary/10 p-4">
                      <h3 className="font-medium mb-2">Registration Summary</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Name:</strong> {watch("fullName")}</p>
                        <p><strong>Email:</strong> {watch("email")}</p>
                        <p><strong>Event Type:</strong> {watch("eventType")}</p>
                        <p><strong>Attendees:</strong> {watch("attendees")}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                )}
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={step === 1 ? "ml-auto" : ""}
                >
                  {isSubmitting 
                    ? "Processing..." 
                    : step === 1 
                      ? "Continue" 
                      : "Complete Registration"
                  }
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}




admin 

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

api regist

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const { db } = await connectToDatabase();

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(params.id);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid registration ID' },
        { status: 400 }
      );
    }

    // Update the registration
    const result = await db.collection('registrations').updateOne(
      { _id: objectId },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
        







        sett

        'use client'
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { Loader2 } from "lucide-react";

const AdminSettings = () => {
  const { settings, isLoading, error, updateSettings } = useAdminSettings();
  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    allowRegistrations: true
  });
  
  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || "",
        siteDescription: settings.siteDescription || "",
        contactEmail: settings.contactEmail || "",
        allowRegistrations: settings.allowRegistrations ?? true
      });
    }
  }, [settings]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };
  
  const saveSettings = async () => {
    try {
      await updateSettings(formData);
      toast({
        title: "Success",
        description: "Settings have been updated successfully."
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
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

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-500 p-4">
          Error loading settings: {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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
                    value={formData.siteName}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md bg-background border border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="siteDescription" className="text-sm font-medium">Site Description</label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={formData.siteDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 rounded-md bg-background border border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md bg-background border border-border"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="allowRegistrations"
                    name="allowRegistrations"
                    type="checkbox"
                    checked={formData.allowRegistrations}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="allowRegistrations" className="text-sm font-medium">Allow New Registrations</label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={saveSettings}>Save Changes</Button>
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
                <div className="mt-1">{new Date().toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;#   T h a h f e e z - v i d e o - v a u l t  
 