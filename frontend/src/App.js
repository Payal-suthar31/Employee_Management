import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';


const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const isAdmin = () => {
    return localStorage.getItem('userRole') === 'Admin';
  };

  const PrivateRoute = ({ children, requireAdmin = false }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }

    if (requireAdmin && !isAdmin()) {
      return <Navigate to="/employee/dashboard" />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute requireAdmin={true}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee/dashboard"
          element={
            <PrivateRoute>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App; 