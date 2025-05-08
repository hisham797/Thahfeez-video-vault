'use client'

import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, RefreshCw } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();
  const email = sessionStorage.getItem("resetEmail");

  useEffect(() => {
    // Redirect to forgot password if email is not set
    if (!email) {
      router.push("/forgotpassword");
      return;
    }

    // Countdown for resend button
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, router]);

  const handleResendCode = () => {
    setResendDisabled(true);
    setCountdown(60);
    
    // Start countdown again
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    toast({
      title: "Code Resent",
      description: "A new verification code has been sent to your email.",
    });
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // In a real app, this would verify the OTP with an API
      // For demo purposes, we'll accept any 6-digit code
      setTimeout(() => {
        // Store OTP in session for the update password page
        sessionStorage.setItem("verifiedOTP", otp);
        router.push("/updatepassword");
      }, 1500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
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
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Verify Code</h1>
              <p className="text-muted-foreground mt-2">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={otp} 
                  onChange={(value: string) => setOtp(value)}
                  className="gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-12 w-12 border-input" />
                    <InputOTPSlot index={1} className="h-12 w-12 border-input" />
                    <InputOTPSlot index={2} className="h-12 w-12 border-input" />
                    <InputOTPSlot index={3} className="h-12 w-12 border-input" />
                    <InputOTPSlot index={4} className="h-12 w-12 border-input" />
                    <InputOTPSlot index={5} className="h-12 w-12 border-input" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button 
                onClick={handleVerify}
                disabled={loading || otp.length !== 6} 
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive a code?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={resendDisabled}
                  onClick={handleResendCode}
                  className="mx-auto flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Code {resendDisabled && `(${countdown}s)`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyOTP;
