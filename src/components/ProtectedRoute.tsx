
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
        toast({
          title: "Authentication required",
          description: "Please log in to access this page.",
          variant: "destructive"
        });
      } else if (adminOnly && !user.isAdmin) {
        navigate("/");
        toast({
          title: "Access denied",
          description: "You do not have permission to access this page.",
          variant: "destructive"
        });
      }
    }
  }, [user, loading, navigate, adminOnly]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user || (adminOnly && !user.isAdmin)) {
    return null;
  }
  
  return <>{children}</>;
}
