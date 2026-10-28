import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn, getUser } from '../utils/auth';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    // 1. Check if logged in
    if (!isLoggedIn()) {
        return <Navigate to="/" replace />;
    }

    // 2. Check for role-based access if roles are provided
    const user = getUser();
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        // Redirect to a default authorized page or show unauthorized
        // For now, redirecting to dashboard or login if they don't have access
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
