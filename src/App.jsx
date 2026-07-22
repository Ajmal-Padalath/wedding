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

export function App() {
  return (
    <WeddingProvider>
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
    </WeddingProvider>
  );
}

export default App;
