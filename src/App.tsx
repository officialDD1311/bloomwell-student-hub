
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SocialWelfare from "./pages/SocialWelfare";
import BloodDonor from "./pages/BloodDonor";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ChatbotPage from "./pages/ChatbotPage";
import SettingsPage from "./pages/SettingsPage";
import StudentDashboard from "./pages/StudentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/social-welfare" element={<SocialWelfare />} />
              <Route path="/blood-donor" element={<BloodDonor />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
