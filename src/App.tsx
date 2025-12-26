import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/departments" element={<Layout><Departments /></Layout>} />
          <Route path="/doctors" element={<Layout><Doctors /></Layout>} />
          <Route path="/patient-entry" element={<Layout><PatientEntry /></Layout>} />
          <Route path="/checkup" element={<Layout><Checkup /></Layout>} />
          <Route path="/admission" element={<Layout><Admission /></Layout>} />
          <Route path="/operations" element={<Layout><Operations /></Layout>} />
          <Route path="/discharge" element={<Layout><Discharge /></Layout>} />
          <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
