import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute = () => {
    const token = localStorage.getItem('token');
    return !token ? <Outlet /> : <Navigate to="/dashboard-organizer" replace />;
};

export default GuestRoute;