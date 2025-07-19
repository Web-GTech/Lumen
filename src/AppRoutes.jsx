import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import BibleModule from '@/pages/BibleModule';
import SongsModule from '@/pages/SongsModule';
import MediaModule from '@/pages/MediaModule';
import PresentationMode from '@/pages/PresentationMode';
import ServicePlanner from '@/pages/ServicePlanner';
import SettingsPage from '@/pages/SettingsPage';
import ProtectedRoute from '@/components/ProtectedRoute';

const AppRoutes = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/presentation" element={<PresentationMode />} />
      
      {!session ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/bible" element={<ProtectedRoute><BibleModule /></ProtectedRoute>} />
          <Route path="/songs" element={<ProtectedRoute><SongsModule /></ProtectedRoute>} />
          <Route path="/media" element={<ProtectedRoute><MediaModule /></ProtectedRoute>} />
          <Route path="/service/:serviceId" element={<ProtectedRoute><ServicePlanner /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;