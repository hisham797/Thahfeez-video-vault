import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { VideoProvider } from "@/contexts/VideoContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Videos from "./app/videos/page";
import VideoDetail from "./app/videodetail/[id]/page";
import NotFound from "./app/notfound/page";
import EventRegistration from "./pages/EventRegistration";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./app/verifyotp/page";
import UpdatePassword from "./app/updatepassword/page";
import PasswordSuccess from "./pages/PasswordSuccess";
import RegistrationSuccess from "./app/registrationsuccess/page";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMessages from "./pages/admin/AdminMessages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <VideoProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/event-registration" element={<EventRegistration />} />
              <Route path="/registration-success" element={<RegistrationSuccess />} />
              
              {/* Password Management Routes */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/password-success" element={<PasswordSuccess />} />
              
              {/* Protected Routes */}
              <Route 
                path="/videos" 
                element={
                  <ProtectedRoute>
                    <Videos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/video/:id" 
                element={
                  <ProtectedRoute>
                    <VideoDetail />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/registrations" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminRegistrations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/videos" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminVideos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/messages" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminMessages />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </VideoProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
