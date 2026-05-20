import { lazy } from 'react';
import Loadable from 'components/Loadable';

const LoginPage = Loadable(lazy(() => import('../views/auth/login/Login')));
const RegisterPage = Loadable(lazy(() => import('views/auth/register/Register')));
const ForgotPasswordPage = Loadable(lazy(() => import('../views/auth/forgot-password/ForgotPassword')));
const OtpVerificationPage = Loadable(lazy(() => import('../views/auth/otp-verfication/OtpVerification')));
const ChangePasswordPage = Loadable(lazy(() => import('../views/auth/change-password/ChangePassword')));
const SettingsPage = Loadable(lazy(() => import('../views/settings/index')));
const CustomerPage = Loadable(lazy(() => import('../views/customer-management/Index')));
const CustomerForm = Loadable(lazy(() => import('../views/customer-management/Form')));
const CustomerView = Loadable(lazy(() => import('../views/customer-management/View')));
const DriverPage = Loadable(lazy(() => import('../views/drivers-management/Index')));
const DriverForm = Loadable(lazy(() => import('../views/drivers-management/Form')));
const DriverView = Loadable(lazy(() => import('../views/drivers-management/View')));
const OrderPage = Loadable(lazy(() => import('../views/order-management/Index')));
const OrderView = Loadable(lazy(() => import('../views/order-management/View')));
const OrderForm = Loadable(lazy(() => import('../views/order-management/Form')));
const Groceries = Loadable(lazy(() => import('../views/merchant-management/groceries/Index')));
const GroceryView = Loadable(lazy(() => import('../views/merchant-management/groceries/View')));
const GroceryForm = Loadable(lazy(() => import('../views/merchant-management/groceries/Form')));
const Pharmacy = Loadable(lazy(() => import('../views/merchant-management/pharmacies/Index')));
const PharmacyView = Loadable(lazy(() => import('../views/merchant-management/pharmacies/View')));
const PharmacyForm = Loadable(lazy(() => import('../views/merchant-management/pharmacies/Form')));
const Restaurants = Loadable(lazy(() => import('../views/merchant-management/restaurants/Index')));
const RestaurantView = Loadable(lazy(() => import('../views/merchant-management/restaurants/View')));
const RestaurantForm = Loadable(lazy(() => import('../views/merchant-management/restaurants/Form')));
const Liquors = Loadable(lazy(() => import('../views/merchant-management/liquors/Index')));
const LiquorView = Loadable(lazy(() => import('../views/merchant-management/liquors/View')));
const LiquorForm = Loadable(lazy(() => import('../views/merchant-management/liquors/Form')));
const FoodTypePage = Loadable(lazy(() => import('../views/foodtype/Index')));
const ProductTypePage = Loadable(lazy(() => import('../views/product-type/Index')));
const StoreTypePage = Loadable(lazy(() => import('../views/store-type/Index')));
const CategoryPage = Loadable(lazy(() => import('../views/category/Index')));
const TipsPage = Loadable(lazy(() => import('../views/tips/Index')));
const BannerPage = Loadable(lazy(() => import('../views/banner/Index')));
const FeePage = Loadable(lazy(() => import('../views/fee/Index')));
const couponsPage = Loadable(lazy(() => import('../views/coupons/Index')));
const Staff = Loadable(lazy(() => import('../views/merchant-management/staff/Index')));
const StaffView = Loadable(lazy(() => import('../views/merchant-management/staff/View')));
const StaffForm = Loadable(lazy(() => import('../views/merchant-management/staff/FormModal')));
const TermsPolicyPage = Loadable(lazy(() => import('../views/terms-policy/Index')));
const DefaultDashboard = Loadable(lazy(() => import('views/navigation/dashboard/Default')));

export const PublicRoutes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
    exact: true
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    exact: true
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password',
    component: ForgotPasswordPage,
    exact: true
  },
  {
    path: '/otp-verification',
    name: 'Otp Verification',
    component: OtpVerificationPage,
    exact: true
  }
];

export const PrivateRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DefaultDashboard,
    exact: true
  },
  {
    path: '/change-password',
    name: 'Change Password',
    component: ChangePasswordPage,
    exact: true
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage,
    exact: true
  },

  // ==============================|| MERCHANT MANAGEMENT ROUTES ||============================== //
  {
    path: '/merchant-management',
    name: 'Merchant Management',
    children: [
      // Groceries
      {
        path: '/merchant-management/groceries',
        name: 'Groceries',
        component: Groceries,
        exact: true,
        children: [
          {
            path: '/merchant-management/groceries/add',
            name: 'Add Groceries',
            component: GroceryForm,
            exact: true
          },
          {
            path: '/merchant-management/groceries/edit/:id',
            name: 'Edit Groceries',
            component: GroceryForm,
            exact: true
          },
          {
            path: '/merchant-management/groceries/view/:id',
            name: 'View Groceries',
            component: GroceryView,
            exact: true
          }
        ]
      },
      // ----------------Pharmacies----------------
      {
        path: '/merchant-management/pharmacies',
        name: 'Pharmacies',
        component: Pharmacy,
        exact: true,
        children: [
          {
            path: '/merchant-management/pharmacies/add',
            name: 'Add Pharmacies',
            component: PharmacyForm,
            exact: true
          },
          {
            path: '/merchant-management/pharmacies/edit/:id',
            name: 'Edit Pharmacies',
            component: PharmacyForm,
            exact: true
          },
          {
            path: '/merchant-management/pharmacies/view/:id',
            name: 'View Pharmacies',
            component: PharmacyView,
            exact: true
          }
        ]
      },
      // ----------------Restaurants----------------
      {
        path: '/merchant-management/restaurants',
        name: 'Restaurants',
        component: Restaurants,
        exact: true,
        children: [
          {
            path: '/merchant-management/restaurants/add',
            name: 'Add Restaurants',
            component: RestaurantForm,
            exact: true
          },
          {
            path: '/merchant-management/restaurants/edit/:id',
            name: 'Edit Restaurants',
            component: RestaurantForm,
            exact: true
          },
          {
            path: '/merchant-management/restaurants/view/:id',
            name: 'View Restaurants',
            component: RestaurantView,
            exact: true
          }
        ]
      },
      // ----------------Liquors----------------
      {
        path: '/merchant-management/liquors',
        name: 'Liquors',
        component: Liquors,
        exact: true,
        children: [
          {
            path: '/merchant-management/liquors/add',
            name: 'Add Liquor',
            component: LiquorForm,
            exact: true
          },
          {
            path: '/merchant-management/liquors/edit/:id',
            name: 'Edit Liquor',
            component: LiquorForm,
            exact: true
          },
          {
            path: '/merchant-management/liquors/view/:id',
            name: 'View Liquor',
            component: LiquorView,
            exact: true
          }
        ]
      },
      //----------------------- Staff ------------------------
      {
        path: '/merchant-management/staff',
        name: 'Staff',
        component: Staff,
        exact: true,
        children: [
          {
            path: '/merchant-management/staff/add',
            name: 'Add Staff',
            component: StaffForm,
            exact: true
          },
          {
            path: '/merchant-management/staff/edit/:id',
            name: 'Edit Staff',
            component: StaffForm,
            exact: true
          },
          {
            path: '/merchant-management/staff/view/:id',
            name: 'View Staff',
            component: StaffView,
            exact: true
          }
        ]
      }
    ]
  },

  // ==============================|| CUSTOMER MANAGEMENT ROUTES ||============================== //
  {
    path: '/customer-management',
    name: 'Customer Management',
    component: CustomerPage,
    exact: true,
    children: [
      {
        path: '/customer-management/add',
        name: 'Add Customer',
        component: CustomerForm,
        exact: true
      },
      {
        path: '/customer-management/edit/:id',
        name: 'Edit Customer',
        component: CustomerForm,
        exact: true
      },
      {
        path: '/customer-management/view/:id',
        name: 'View Customer',
        component: CustomerView,
        exact: true
      }
    ]
  },

  // ==============================|| DRIVER MANAGEMENT ROUTES ||============================== //
  {
    path: '/driver-management',
    name: 'Driver Management',
    component: DriverPage,
    exact: true,
    children: [
      {
        path: '/driver-management/add',
        name: 'Add Driver',
        component: DriverForm,
        exact: true
      },
      {
        path: '/driver-management/edit/:id',
        name: 'Edit Driver',
        component: DriverForm,
        exact: true
      },
      {
        path: '/driver-management/view/:id',
        name: 'View Driver',
        component: DriverView,
        exact: true
      }
    ]
  },

  // ==============================|| ORDER MANAGEMENT ROUTES ||============================== //
  {
    path: '/order-management',
    name: 'Order Management',
    component: OrderPage,
    exact: true,
    children: [
      {
        path: '/order-management/edit/:id',
        name: 'Edit Order',
        component: OrderForm,
        exact: true
      },
      {
        path: '/order-management/view/:id',
        name: 'View Order',
        component: OrderView,
        exact: true
      }
    ]
  },
  {
    path: '/food-type',
    name: 'Food Type',
    component: FoodTypePage,
    exact: true
  },
  {
    path: '/product-type',
    name: 'Product Type',
    component: ProductTypePage,
    exact: true
  },
  {
    path: '/store-type',
    name: 'Store Type',
    component: StoreTypePage,
    exact: true
  },
  {
    path: '/category',
    name: 'Category',
    component: CategoryPage,
    exact: true
  },
  {
    path: '/fee',
    name: 'Fee',
    component: FeePage,
    exact: true
  },
  {
    path: '/coupons',
    name: 'coupons',
    component: couponsPage,
    exact: true
  },
  {
    path: '/tips',
    name: 'Tips',
    component: TipsPage,
    exact: true
  },
  {
    path: '/banner',
    name: 'Banner',
    component: BannerPage,
    exact: true
  },
  {
    path: '/terms-policy',
    name: 'Terms & Policy',
    component: TermsPolicyPage,
    exact: true
  }
];

// ==============================|| UTILITY FUNCTIONS ||============================== //

/**
 * Flatten nested routes into a single array
 * This function recursively extracts all routes including nested children
 * @param {Array} routes - Array of route objects
 * @returns {Array} - Flattened array of all routes
 */
export const flattenRoutes = (routes) => {
  let flatRoutes = [];

  routes.forEach((route) => {
    if (route.children && route.children.length > 0) {
      // Add the parent route (if it has a component)
      if (route.component) {
        flatRoutes.push({
          path: route.path,
          name: route.name,
          component: route.component,
          exact: route.exact
        });
      }
      // Recursively flatten children
      flatRoutes = flatRoutes.concat(flattenRoutes(route.children));
    } else {
      // Add leaf route
      flatRoutes.push({
        path: route.path,
        name: route.name,
        component: route.component,
        exact: route.exact
      });
    }
  });

  return flatRoutes;
};

// Export flattened routes for backward compatibility
export const FlatPrivateRoutes = flattenRoutes(PrivateRoutes);
export const FlatPublicRoutes = flattenRoutes(PublicRoutes);
