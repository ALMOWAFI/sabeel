import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { CanvasPage } from './pages/CanvasPage';
import { CollaborationPage } from './pages/CollaborationPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

export function App() {
  const { user, isLoading, isAuthenticated } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/canvas" element={<CanvasPage />} />
        <Route path="/collaboration" element={<CollaborationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth/canvas/callback" element={<Navigate to="/" replace />} />
        <Route path="/auth/jupyter/callback" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}