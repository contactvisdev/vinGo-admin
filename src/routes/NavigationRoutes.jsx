import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import DefaultPages from '../views/auth//';

// render - dashboard pages
// const DefaultPages = Loadable(lazy(() => import('views/navigation/dashboard/Default')));
// const LoginPage = Loadable(lazy(() => import('views/auth//')));

// ==============================|| NAVIGATION ROUTING ||============================== //

const NavigationRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/',
          element: <DefaultPages />
        }
      ]
    }
  ]
};

export default NavigationRoutes;

// import { lazy } from 'react';
// import Loadable from 'components/Loadable';

// // render - login page
// const LoginPage = Loadable(lazy(() => import('views/auth//')));

// // ==============================|| LOGIN ROUTE ||============================== //

// const NavigationRoutes = {
//   path: '/',        // root path
//   element: <LoginPage />,  // directly render login page
// };

// export default NavigationRoutes;
