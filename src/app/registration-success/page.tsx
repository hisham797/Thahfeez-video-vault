'use client';

import React from 'react';
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegistrationSuccess() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registration Successful!</CardTitle>
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
            <div className="rounded-lg bg-primary/10 p-6">
              <h3 className="text-lg font-medium mb-4">Thank you for registering!</h3>
              <p className="mb-4">Your account has been created successfully. You can now:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Access all event materials</li>
                <li>Watch exclusive videos</li>
                <li>Participate in discussions</li>
                <li>Track your learning progress</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Next Steps</h4>
              <p className="text-sm text-muted-foreground">
                We've sent a confirmation email with your login details. Please check your inbox.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">
                Return Home
              </Link>
            </Button>
            <Button asChild>
              <Link href="/videos" className="group">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
} 