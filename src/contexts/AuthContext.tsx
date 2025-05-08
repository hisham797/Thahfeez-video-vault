import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

interface User {
  email: string;
  fullName?: string;
  isAdmin: boolean;
  isRegistered: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Call the login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ 
          title: "Login failed", 
          description: data.error || "Invalid email or password. Please try again.",
          variant: "destructive" 
        });
        return false;
      }

      // Store user data
      const userData = {
        email: data.user.email,
        fullName: data.user.fullName,
        isAdmin: data.user.role === 'admin',
        isRegistered: data.user.isRegistered
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({ 
        title: "Login successful!", 
        description: "Welcome back to Vista Video Vault." 
      });
      return true;
    } catch (error) {
      toast({ 
        title: "Login error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive" 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Get existing users
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (storedUsers.some((user: any) => user.email === email)) {
        toast({ 
          title: "Registration failed", 
          description: "Email already in use. Please use another email address.",
          variant: "destructive" 
        });
        return false;
      }
      
      // Add new user
      const newUser = { name, email, password };
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      // Auto login
      const loggedInUser = { email, name, isAdmin: false, isRegistered: true };
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      toast({ 
        title: "Registration successful!", 
        description: "Welcome to Vista Video Vault. You're now logged in." 
      });
      return true;
    } catch (error) {
      toast({ 
        title: "Registration error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive" 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({ title: "Logged out", description: "You've been successfully logged out." });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
