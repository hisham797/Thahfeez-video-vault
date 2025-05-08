'use client'

import React, { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const PasswordSuccess = () => {
  useEffect(() => {
    // Clean up any remaining session storage
    sessionStorage.removeItem("resetEmail");
    sessionStorage.removeItem("verifiedOTP");
  }, []);

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-md mx-auto bg-card shadow-lg rounded-lg overflow-hidden border border-border">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto bg-green-500/20 w-20 h-20 flex items-center justify-center rounded-full mb-6">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold">Password Updated!</h1>
              <p className="text-muted-foreground mt-3">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
            </div>

            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/login">
                  Go to Login
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordSuccess;
