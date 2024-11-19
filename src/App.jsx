import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import Map from './pages/peta';
import DataPage from './pages/data';
import LoginAdmin from './pages/LoginAdmin';
import AdminPage from './pages/Admin';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/dashboard';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/peta" element={<Map />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/login" element={<LoginAdmin />} />
        <Route path="/dashboard" element={<AdminPage />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;