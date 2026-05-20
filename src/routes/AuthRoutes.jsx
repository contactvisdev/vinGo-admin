import React from 'react';
import { Navigate, Outlet, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FlatPublicRoutes } from './AllRoutes';

const RequireGuest = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export const AuthRoutes = (
  <Route element={<RequireGuest />}>
    {FlatPublicRoutes.map((route) => (
      <Route key={route.path} path={route.path} element={<route.component />} />
    ))}
  </Route>
);
