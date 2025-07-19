import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { PresentationProvider } from '@/contexts/PresentationContext';
import { AppStateProvider } from '@/contexts/AppStateContext';

import AppRoutes from '@/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppStateProvider>
            <PresentationProvider>
              <Helmet>
                <title>Lumen - Sistema de Apresentação para Igrejas</title>
                <meta name="description" content="Sistema completo de apresentação para igrejas com Bíblia, músicas e mídias. Controle remoto e modo apresentação para telões." />
              </Helmet>
              
              <div className="min-h-screen bg-background text-foreground">
                <AppRoutes />
                <Toaster />
              </div>
            </PresentationProvider>
          </AppStateProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;