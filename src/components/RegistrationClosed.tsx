import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ban } from "lucide-react";

const RegistrationClosed = () => {
  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card shadow-lg rounded-lg overflow-hidden border border-border">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-full bg-destructive/20 flex items-center justify-center">
                  <Ban size={48} className="text-destructive" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Registration Closed</h1>
              <p className="text-muted-foreground text-lg mb-8">
                We're sorry, but event registrations are currently not being accepted.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-6 mb-8">
                <h2 className="font-semibold text-lg mb-3">Registration Info</h2>
                <div className="space-y-3 text-left text-muted-foreground">
                  <p>Registrations for this event are temporarily closed. We may open registrations again in the future.</p>
                  <p>If you have any questions or need assistance, please contact our support team.</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline" size="lg">
                  <Link href="/">Return to Home</Link>
                </Button>
                <Button asChild size="lg">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegistrationClosed; 