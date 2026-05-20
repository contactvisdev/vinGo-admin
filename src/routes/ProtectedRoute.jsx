import { Navigate, Outlet, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from 'layout/Dashboard';
import { FlatPrivateRoutes } from './AllRoutes';

const RequireAuth = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export const ProtectedRoutes = (
  <Route element={<RequireAuth />}>
    <Route element={<DashboardLayout />}>
      {FlatPrivateRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={<route.component />} />
      ))}
    </Route>
  </Route>
);
