import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Doctors from "./pages/Doctors";
import PatientEntry from "./pages/PatientEntry";
import Checkup from "./pages/Checkup";
import Admission from "./pages/Admission";
import Operations from "./pages/Operations";
import Discharge from "./pages/Discharge";
import Rooms from "./pages/Rooms";
import VoiceAssistantDemo from "./pages/VoiceAssistantDemo";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/departments" element={
              <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']}>
                <Layout><Departments /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/doctors" element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <Layout><Doctors /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/patient-entry" element={
              <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']}>
                <Layout><PatientEntry /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/checkup" element={
              <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']}>
                <Layout><Checkup /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admission" element={
              <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']}>
                <Layout><Admission /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/operations" element={
              <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']}>
                <Layout><Operations /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/discharge" element={
              <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']}>
                <Layout><Discharge /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/rooms" element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <Layout><Rooms /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/voice-assistant" element={
              <ProtectedRoute>
                <Layout><VoiceAssistantDemo /></Layout>
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
