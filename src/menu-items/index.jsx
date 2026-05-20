import tableComponents from './tables';
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  // ---------------- dashboard ----------------
  items: [
    {
      id: 'group-dashboard-loading-unique',
      type: 'group',
      icon: <i className="ph ph-house-line" />,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: <i className="ph ph-house-line" />,
          url: '/dashboard'
        }
      ]
    },
    // ---------------- user management ----------------
    {
      id: 'group-user-loading-unique',
      title: 'User Management',
      type: 'group',
      icon: <i className="ph ph-users" />,
      children: [
        {
          id: 'user-management',
          title: 'User Management',
          type: 'collapse',
          icon: <i className="ph ph-user-circle" />,
          children: [
            {
              id: 'merchant',
              title: 'Merchant',
              type: 'collapse',
              icon: <i className="ph ph-storefront" />,
              // url: '/merchant-management',
              children: [
                {
                  id: 'restaurants',
                  title: 'Restaurants',
                  type: 'item',
                  icon: <i className="ph ph-storefront" />,
                  url: '/merchant-management/restaurants'
                },
                {
                  id: 'groceries',
                  title: 'Groceries',
                  type: 'item',
                  icon: <i className="ph ph-shopping-cart" />,
                  url: '/merchant-management/groceries'
                },
                {
                  id: 'pharmacies',
                  title: 'Pharmacy',
                  type: 'item',
                  icon: <i className="ph ph-first-aid" />,
                  url: '/merchant-management/pharmacies'
                },
                {
                  id: 'liquors',
                  title: 'Liquor',
                  type: 'item',
                  icon: <i className="ph ph-wine" />,
                  url: '/merchant-management/liquors'
                }
                // {
                //   id: 'staff',
                //   title: 'Staff',
                //   type: 'item',
                //   icon: <i className="ph ph-users" />,
                //   url: '/merchant-management/staff'
                // }
              ]
            },
            {
              id: 'customer',
              title: 'Customer',
              type: 'item',
              icon: <i className="ph ph-users-three" />,
              url: '/customer-management'
            },
            {
              id: 'driver',
              title: 'Driver',
              type: 'item',
              icon: <i className="ph ph-steering-wheel" />,
              url: '/driver-management'
            }
          ]
        }
      ]
    },
    // ---------------- order ----------------
    {
      id: 'group-order',
      type: 'group',
      children: [
        {
          id: 'order',
          title: 'Orders',
          type: 'item',
          icon: <i className="ph ph-package" />,
          url: '/order-management'
        }
      ]
    },
    // ---------------- category ----------------
    {
      id: 'category-loading-unique',
      type: 'group',
      children: [
        {
          id: 'category',
          title: 'Category',
          type: 'item',
          icon: <i className="ph ph-squares-four" />,
          url: '/category'
        }
      ]
    },
    // ---------------- food type ----------------
    {
      id: 'food-type-loading-unique',
      type: 'group',
      children: [
        {
          id: 'food-type',
          title: 'Food Type',
          type: 'item',
          icon: <i className="ph ph-bowl-food" />,
          url: '/food-type'
        }
      ]
    },
    // ---------------- product type ----------------
    {
      id: 'product-type-loading-unique',
      type: 'group',
      children: [
        {
          id: 'product-type',
          title: 'Product Type',
          type: 'item',
          icon: <i className="ph ph-tag" />,
          url: '/product-type'
        }
      ]
    },
    // ---------------- store type ----------------
    {
      id: 'store-type-loading-unique',
      type: 'group',
      children: [
        {
          id: 'store-type',
          title: 'Store Type',
          type: 'item',
          icon: <i className="ph ph-storefront" />,
          url: '/store-type'
        }
      ]
    },
    // ---------------- fee ----------------
    {
      id: 'fee-loading-unique',
      type: 'group',
      children: [
        {
          id: 'fee',
          title: 'Fee',
          type: 'item',
          icon: <i className="ph ph-money" />,
          url: '/fee'
        }
      ]
    },
    // ---------------- coupons ----------------
    {
      id: 'coupons-loading-unique',
      type: 'group',
      children: [
        {
          id: 'coupons',
          title: 'coupons',
          type: 'item',
          icon: <i className="ph ph-ticket" />,
          url: '/coupons'
        }
      ]
    },
    // ---------------- tips ----------------
    {
      id: 'tips-loading-unique',
      type: 'group',
      children: [
        {
          id: 'tips',
          title: 'Tips',
          type: 'item',
          icon: <i className="ph ph-hand-coins" />,
          url: '/tips'
        }
      ]
    },
    // ---------------- banner ----------------
    {
      id: 'banner-loading-unique',
      type: 'group',
      children: [
        {
          id: 'banner',
          title: 'Banner',
          type: 'item',
          icon: <i className="ph ph-image" />,
          url: '/banner'
        }
      ]
    },
    // ---------------- terms & policy ----------------
    {
      id: 'terms-policy-loading-unique',
      type: 'group',
      children: [
        {
          id: 'terms-policy',
          title: 'Terms & Policy',
          type: 'item',
          icon: <i className="ph ph-file-text" />,
          url: '/terms-policy'
        }
      ]
    },
    // ---------------- settings ----------------
    {
      id: 'group-settings-loading-unique',
      type: 'group',
      children: [
        {
          id: 'Setttings',
          title: 'Settings',
          type: 'item',
          icon: <i className="ph ph-gear-six" />,
          url: '/settings'
        }
      ]
    }
  ]
};

export default menuItems;
