import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Toast from './Toast';
import { useApp } from '../context/AppContext';

const Layout = () => {
  const { isAuthenticated } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected Route Check: redirect to /login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onCloseMobile={() => setSidebarOpen(false)} 
      />
      <div className="main-wrapper">
        <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <Toast />
    </div>
  );
};

export default Layout;
