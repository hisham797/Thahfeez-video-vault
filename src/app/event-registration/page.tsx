'use client'
import React, { useState, useEffect } from 'react';
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

const EventRegistration = () => {
  const { user, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkRegistration = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`/api/registrations/check?email=${user.email}`);
          const data = await response.json();
          setIsAlreadyRegistered(data.isRegistered);
        } catch (error) {
          console.error('Error checking registration:', error);
        }
      }
    };

    checkRegistration();
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
      
      // Register the user with the API
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Automatically log in the user
      await login(data.email, password);

      // Show success message
      toast({ 
        title: "Registration successful!",
        description: "Welcome to Vista Video Vault. You're now logged in.",
      });
      
      // Navigate to success page
      router.push("/registration-success");
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
  
 
  if (isAlreadyRegistered) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto border-2 border-primary/20">
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
      </Layout>
    );
  }
  if (!user) {
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
};

export default EventRegistration;
