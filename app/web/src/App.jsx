import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import DashboardPage from '@/pages/DashboardPage.jsx';
import PlaylistsPage from '@/pages/PlaylistsPage.jsx';
import PlaylistDetailsPage from '@/pages/PlaylistDetailsPage.jsx';
import VideoDetailsPage from '@/pages/VideoDetailsPage.jsx';
import SaveVideoPage from '@/pages/SaveVideoPage.jsx';
import NotesPage from '@/pages/NotesPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage.jsx';
import TermsOfServicePage from '@/pages/TermsOfServicePage.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import PrivateRoute from '@/components/PrivateRoute.jsx';
import { Toaster } from '@/components/ui/sonner';

import ErrorBoundary from '@/components/ErrorBoundary.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
              <Route path="/save-video" element={<SaveVideoPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/video/:id" element={<VideoDetailsPage />} />
            </Route>
          </Routes>
        </ErrorBoundary>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;