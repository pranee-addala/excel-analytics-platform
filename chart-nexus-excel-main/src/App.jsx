import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ChartAnalysisPage from './pages/ChartAnalysisPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="flex-grow">
                      <Dashboard />
                    </main>
                    <Footer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chart-analysis"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="flex-grow">
                      <ChartAnalysisPage />
                    </main>
                    <Footer />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;