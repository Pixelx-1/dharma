
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import TranscriptionPage from "./pages/TranscriptionPage";
import FilesPage from "./pages/FilesPage";
import FirPage from "./pages/FirPage";
import FirViewPage from "./pages/FirViewPage";
import VideosPage from "./pages/VideosPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/transcription" element={
                <ProtectedRoute>
                  <TranscriptionPage />
                </ProtectedRoute>
              } />
              <Route path="/files" element={
                <ProtectedRoute>
                  <FilesPage />
                </ProtectedRoute>
              } />
              <Route path="/fir" element={
                <ProtectedRoute>
                  <FirPage />
                </ProtectedRoute>
              } />
              <Route path="/fir/:firId" element={
                <ProtectedRoute>
                  <FirViewPage />
                </ProtectedRoute>
              } />
              <Route path="/videos" element={
                <ProtectedRoute>
                  <VideosPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
