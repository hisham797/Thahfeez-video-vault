
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFound = () => {
  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="btn-primary">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
