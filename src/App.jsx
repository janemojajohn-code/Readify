import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/AuthContext';
import AppLayout from '@/components/layout/AppLayout';

import Dashboard from '@/pages/Dashboard';
import Library from '@/pages/Library';
import Upload from '@/pages/Upload';
import Reader from '@/pages/Reader';
import Notes from '@/pages/Notes';
import Settings from '@/pages/Settings';
import PageNotFound from '@/pages/PageNotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="library" element={<Library />} />
            <Route path="upload" element={<Upload />} />
            <Route path="reader/:id" element={<Reader />} />
            <Route path="notes" element={<Notes />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
