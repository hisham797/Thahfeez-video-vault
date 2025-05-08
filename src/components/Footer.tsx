"use client";
import Link from 'next/link';
import { useSettings } from "@/hooks/use-settings";

export function Footer() {
  const { settings, loading: settingsLoading } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent hero-gradient">
                {settingsLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  settings?.siteName || 'Vista Video Vault'
                )}
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground">
            Thahfeez Video Vault is your gateway to high-quality educational content.
            Learn at your own pace with our vast library of carefully curated videos.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/videos" className="text-muted-foreground hover:text-foreground transition-colors">Videos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} Vista Video Vault. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-muted-foreground text-sm">
              Designed with ❤️ for learning
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}