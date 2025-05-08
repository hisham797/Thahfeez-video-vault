'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  organization: z.string().min(2, 'Organization name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  eventType: z.string().min(1, 'Please select an event type'),
  specialRequirements: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      toast({
        title: "Registration Successful!",
        description: "Thank you for registering. We'll contact you soon.",
      });

      reset(); // Reset form after successful submission
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-200">
            Full Name
          </label>
          <Input
            id="name"
            {...register('name')}
            className="bg-[#1A1F2C] border-gray-700"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-200">
            Email
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className="bg-[#1A1F2C] border-gray-700"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="organization" className="text-sm font-medium text-gray-200">
            Organization
          </label>
          <Input
            id="organization"
            {...register('organization')}
            className="bg-[#1A1F2C] border-gray-700"
            placeholder="Enter your organization"
          />
          {errors.organization && (
            <p className="text-sm text-red-500">{errors.organization.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-200">
            Phone Number
          </label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            className="bg-[#1A1F2C] border-gray-700"
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="eventType" className="text-sm font-medium text-gray-200">
            Event Type
          </label>
          <Select onValueChange={(value) => register('eventType').onChange({ target: { value } })}>
            <SelectTrigger className="bg-[#1A1F2C] border-gray-700">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seminar">Seminar</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
            </SelectContent>
          </Select>
          {errors.eventType && (
            <p className="text-sm text-red-500">{errors.eventType.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="specialRequirements" className="text-sm font-medium text-gray-200">
            Special Requirements
          </label>
          <Textarea
            id="specialRequirements"
            {...register('specialRequirements')}
            className="bg-[#1A1F2C] border-gray-700"
            placeholder="Any special requirements or notes"
            rows={3}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Register Now'
        )}
      </Button>
    </form>
  );
} 