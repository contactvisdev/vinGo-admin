const endPoints = {
  LOGIN: 'admins/login',
  LOGOUT: 'admins/logout',
  FORGOT_PASSWORD: 'admins/requestOTP',
  VERIFY_OTP: 'admins/verify-otp',
  REQUEST_OTP: 'admins/requestOTP',
  CHANGE_PASSWORD: 'admins/resetPassword',
  PROFILE: 'admins/getById',
  PROFILE_BY_ID: (id) => `admins/${id}`,
  MERCHANT: 'admins/merchants/profile',
  MERCHANT_BY_ID: (id) => `admins/merchants/profile/${id}`,
  MERCHANT_SIGNUP: 'merchants/profile/admin',
  CATEGORIES: 'category',
  UPLOAD_SINGLE: 'upload/single',
  CUSTOMER: 'admins/customers',
  ADD_CUSTOMER: 'admins/customers/create/user',
  CUSTOMER_BY_ID: (id) => `admins/customers/${id}`,
  DRIVER_GET: 'admins/drivers/get',
  DRIVER: 'admins/drivers',
  ADD_DRIVER: 'admins/drivers/create/user',
  DRIVER_BY_ID: (id) => `admins/drivers/${id}`,
  ORDER: 'admins/order',
  ORDER_BY_ID: (id) => `admins/order/${id}`,
  //--------Groceries
  GROCERIES: 'merchants/profile/status',
  FOOD_TYPE: 'food-type',
  FEE: 'admins/fee',
  COUPON: 'coupon',
  TIP: 'tip',
  BANNER_ALL: 'banner/allBanners',
  BANNER: 'banner',
  BANNER_REORDER: 'banner/reorderBanners',
  PRODUCT_TYPE: 'productType',
  STORE_TYPE: 'storeType',

  // -------- Staff
  BUSINESS_STAFF: 'business-staff',
  BUSINESS_STAFF_BY_ID: (id) => `business-staff/${id}`,
  BUSINESS_STAFF_EMAIL_OTP: 'business-staff/requestOtp',
  BUSINESS_STAFF_MOBILE_OTP: 'business-staff/mobile-otp',
  BUSINESS_STAFF_LOGIN: 'business-staff/login',

  // Terms & Policy
  TERMS_POLICY: 'terms-policy'
};
export default endPoints;
