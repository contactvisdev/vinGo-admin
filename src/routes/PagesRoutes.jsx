import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthLayout from 'layout/Auth';
import { Navigate } from 'react-router-dom';

// render - login pages
const LoginPage = Loadable(lazy(() => import('views/auth//')));

// render - register pages
const RegisterPage = Loadable(lazy(() => import('views/auth/register/Register')));

// ==============================|| AUTH PAGES ROUTING ||============================== //

// const PagesRoutes = {
//   path: '/',
//   children: [
//     {
//       element: <AuthLayout />,
//       children: [
//         {
//           path: 'login',
//           element: <LoginPage />
//         },
//         {
//           path: 'register',
//           element: <RegisterPage />
//         }
//       ]
//     }
//   ]
// };

const PagesRoutes = [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> }
    ]
  }
];

export default PagesRoutes;
