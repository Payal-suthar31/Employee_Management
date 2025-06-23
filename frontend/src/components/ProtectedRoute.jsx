import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = authService.getCurrentUser();
  
  if (!user?.token) {
    window.location.href = '/';
    return null;
  }

  const userRole = user.role?.toLowerCase();
  const allowedLowerRoles = allowedRoles.map(role => role.toLowerCase());

  if (!allowedLowerRoles.includes(userRole)) {
    const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
    window.location.href = redirectPath;
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
