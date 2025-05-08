'use client'

import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      // In a real app, this would call an API endpoint
      // For demo purposes, we'll simulate success and navigate to OTP verification
      toast({
        title: "Email Sent",
        description: "A verification code has been sent to your email address.",
      });
      
      // Store the email in session storage for the verification page
      sessionStorage.setItem("resetEmail", email);
      
      // Navigate to OTP verification page
      setTimeout(() => {
        router.push("/verify-otp");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-md mx-auto bg-card shadow-lg rounded-lg overflow-hidden border border-border">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Forgot Password</h1>
              <p className="text-muted-foreground mt-2">
                Enter your email address to receive a verification code
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
