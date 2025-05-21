
import React from 'react';
import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AppRoutes from '@/routes/AppRoutes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

function GlobalLoadingIndicator() {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900 bg-opacity-80 backdrop-blur-sm">
        <Loader2 className="h-16 w-16 text-purple-400 animate-spin" />
      </div>
    );
  }
  return null;
}

function AppCore() {
  const location = useLocation();
  return (
    <>
      <GlobalLoadingIndicator />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <AppCore />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
