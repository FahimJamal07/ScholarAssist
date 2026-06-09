import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.jsx';
import Upload from '../pages/Upload.jsx';
import Chat from '../pages/Chat.jsx';
import Compare from '../pages/Compare.jsx';
import LiteratureReview from '../pages/LiteratureReview.jsx';
import Novelty from '../pages/Novelty.jsx';
import Analytics from '../pages/Analytics.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/literature-review" element={<LiteratureReview />} />
      <Route path="/novelty" element={<Novelty />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
