import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeddingProvider } from './context/WeddingContext';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Places } from './pages/Places';
import { People } from './pages/People';
import { Expenses } from './pages/Expenses';
import { Reports } from './pages/Reports';
import { Checklist } from './pages/Checklist';
import { Settings } from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginGate } from './components/auth/LoginGate';

function WeddingApp() {
  const { user } = useAuth();

  if (!user) return <LoginGate />;

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/places" element={<Places />} />
          <Route path="/people" element={<People />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export function App() {
  return (
    <WeddingProvider>
      <AuthProvider>
        <WeddingApp />
      </AuthProvider>
    </WeddingProvider>
  );
}

export default App;
