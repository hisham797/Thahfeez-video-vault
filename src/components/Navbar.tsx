"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileDialog } from "@/components/ProfileDialog";
import { useSettings } from "@/hooks/use-settings";

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const { settings, loading: settingsLoading } = useSettings();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent hero-gradient">
            {settingsLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              settings?.siteName || 'Vista Video Vault'
            )}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
          {user && <Link href="/videos" className="nav-link">Videos</Link>}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User size={18} />
                  <span>{user.fullName || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem 
                  onClick={() => setShowProfileDialog(true)}
                  className="flex items-center space-x-2"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </DropdownMenuItem> */}
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="flex items-center space-x-2 text-red-500">
                  <LogOut size={16} />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="btn-primary">
                <Link href="/event-registration">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="container flex flex-col space-y-4 py-4">
            <Link 
              href="/" 
              className="px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {user && (
              <Link 
                href="/videos" 
                className="px-4 py-2 hover:bg-accent rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Videos
              </Link>
            )}
            {user ? (
              <div className="flex flex-col space-y-2 border-t border-border pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowProfileDialog(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-start space-x-2"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Button>
                {user.isAdmin && (
                  <Link 
                    href="/admin" 
                    className="px-4 py-2 hover:bg-accent rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Button 
                  variant="destructive"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 border-t border-border pt-4">
                <Button 
                  asChild 
                  variant="outline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button 
                  asChild 
                  className="btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/event-registration">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Profile Dialog */}
      {user && (
        <ProfileDialog 
          open={showProfileDialog} 
          onOpenChange={setShowProfileDialog} 
        />
      )}
    </nav>
  );
}
