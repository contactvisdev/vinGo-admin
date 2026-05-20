// ==============================|| VALIDATION SCHEMAS ||============================== //

// Common reusable regex patterns
const patterns = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^[0-9]{7,15}$/,
  name: /^[a-zA-Z\s]+$/,
  pincode: /^[0-9]{4,10}$/,
  time: /^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i,
  url: /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
};

//Email Schema
export const emailSchema = {
  required: 'Email is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  maxLength: { value: 254, message: 'Email must be at most 254 characters' },
  pattern: { value: patterns.email, message: 'Invalid email address' }
};

// Password Schema
export const passwordSchema = {
  required: 'Password is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 8, message: 'Password must be at least 8 characters long' },
  maxLength: { value: 128, message: 'Password must be at most 128 characters' }
};

// Confirm Password Schema
export const confirmPasswordSchema = (getPassword) => ({
  required: 'Confirm Password is required',
  validate: (value) => {
    if (value.trim() === '') return 'Empty space is not allowed';
    return value === getPassword() || 'Passwords do not match';
  },
  minLength: { value: 8, message: 'Password must be at least 8 characters long' },
  maxLength: { value: 128, message: 'Password must be at most 128 characters' }
});

// Name Fields
export const firstNameSchema = {
  required: 'First name is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 2, message: 'First name must be at least 2 characters' },
  maxLength: { value: 50, message: 'First name must be at most 50 characters' },
  pattern: { value: patterns.name, message: 'Invalid first name' }
};

export const lastNameSchema = {
  required: 'Last name is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 2, message: 'Last name must be at least 2 characters' },
  maxLength: { value: 50, message: 'Last name must be at most 50 characters' },
  pattern: { value: patterns.name, message: 'Invalid last name' }
};

// OTP Schema
export const otpSchema = {
  required: 'OTP is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  pattern: { value: /^[0-9]{6}$/, message: 'OTP must be a 6-digit number' }
};

// Owner Info
export const ownerNameSchema = {
  required: 'Owner name is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 2, message: 'Owner name must be at least 2 characters' },
  maxLength: { value: 100, message: 'Owner name must be at most 100 characters' },
  pattern: { value: patterns.name, message: 'Owner name should contain only letters' }
};

export const phoneSchema = {
  required: 'Phone number is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  pattern: { value: patterns.phone, message: 'Enter a valid phone number (7–15 digits)' }
};

export const categoryIdSchema = {
  required: 'Category ID is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed'
};

// Business Details
export const businessNameSchema = {
  required: 'Business name is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 2, message: 'Business name must be at least 2 characters' },
  maxLength: { value: 100, message: 'Business name must be at most 100 characters' }
};

export const storeNameSchema = {
  required: 'Store name is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 2, message: 'Store name must be at least 2 characters' },
  maxLength: { value: 100, message: 'Store name must be at most 100 characters' }
};

export const pharmacynameSchema = {
  required: 'Pharmacy name is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 2, message: 'Pharmacy name must be at least 2 characters' },
  maxLength: { value: 100, message: 'Pharmacy name must be at most 100 characters' }
};

export const addressSchema = {
  required: 'Complete address is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 5, message: 'Please enter a valid address' },
  maxLength: { value: 250, message: 'Address must be at most 250 characters' }
};

export const pincodeSchema = {
  required: 'Pincode is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  pattern: { value: patterns.pincode, message: 'Invalid pincode format' }
};

export const landmarkSchema = {
  validate: (value) => {
    if (!value) return true;
    return value.trim() !== '' || 'Empty space is not allowed';
  },
  minLength: { value: 2, message: 'Landmark must be at least 2 characters' },
  maxLength: { value: 100, message: 'Landmark must be at most 100 characters' }
};

export const latitudeSchema = {
  required: 'Latitude is required',
  validate: (value) => {
    if (value.trim() === '') return 'Empty space is not allowed';
    return !isNaN(value) && value >= -90 && value <= 90 ? true : 'Latitude must be between -90 and 90';
  }
};

export const longitudeSchema = {
  required: 'Longitude is required',
  validate: (value) => {
    if (value.trim() === '') return 'Empty space is not allowed';
    return !isNaN(value) && value >= -180 && value <= 180 ? true : 'Longitude must be between -180 and 180';
  }
};

export const openTimeSchema = {
  required: 'Opening time is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  pattern: { value: patterns.time, message: 'Time must be in 12-hour format (e.g., 09:00 AM)' }
};

export const closeTimeSchema = {
  required: 'Closing time is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  pattern: { value: patterns.time, message: 'Time must be in 12-hour format (e.g., 11:00 PM)' }
};

// Bank Details
export const holderNameSchema = {
  required: 'Account holder name is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 2, message: 'Account holder name must be at least 2 characters' },
  maxLength: { value: 100, message: 'Account holder name must be at most 100 characters' },
  pattern: { value: patterns.name, message: 'Invalid account holder name' }
};

export const bankNameSchema = {
  required: 'Bank name is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 2, message: 'Bank name must be at least 2 characters' },
  maxLength: { value: 100, message: 'Bank name must be at most 100 characters' },
  pattern: { value: patterns.name, message: 'Invalid bank name' }
};

export const swiftBicSchema = {
  required: 'SWIFT/BIC code is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  pattern: {
    value: /^[A-Za-z]{6}[A-Za-z0-9]{2,5}$/,
    message: 'Invalid SWIFT/BIC code format'
  }
};

export const urlSchema = {
  pattern: { value: patterns.url, message: 'Enter a valid URL (must start with http or https)' }
};

export const registrationNumberSchema = {
  required: 'Registration number is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 3, message: 'Must be at least 3 characters' },
  maxLength: { value: 50, message: 'Must be at most 50 characters' }
};

export const taxIdentificationSchema = {
  required: 'Tax Identification Number is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 5, message: 'Must be at least 5 characters' },
  maxLength: { value: 30, message: 'Must be at most 30 characters' }
};

export const documentUrlSchema = {
  ...urlSchema,
  required: 'Document URL is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed'
};

// Location Fields
export const plotNoSchema = {
  required: 'Plot No. is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 1, message: 'Plot No. must be at least 1 character' },
  maxLength: { value: 20, message: 'Plot No. must be at most 20 characters' },
  pattern: { value: /^[a-zA-Z0-9\s/\-.,#]+$/, message: 'Plot No. can only contain letters, numbers, /, -, . and #' }
};

export const floorSchema = {
  required: 'Floor is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  // pattern: { value: /^[a-zA-Z0-9\s-]+$/, message: 'Floor can only contain letters, numbers and hyphens' },
  maxLength: { value: 20, message: 'Floor must be at most 20 characters' }
};

export const buildingNameSchema = {
  required: 'Building Name is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 2, message: 'Building Name must be at least 2 characters' },
  maxLength: { value: 100, message: 'Building Name must be at most 100 characters' },
  pattern: { value: /^[a-zA-Z0-9\s\-.,()&']+$/, message: 'Building Name contains invalid characters' }
};

export const completeAddressSchema = {
  required: 'Complete Address is required',
  validate: (value) => value.trim() !== '' || 'Empty space is not allowed',
  minLength: { value: 10, message: 'Complete Address must be at least 10 characters' },
  maxLength: { value: 250, message: 'Complete Address must be at most 250 characters' }
};

// Date of Birth
export const dobSchema = {
  required: 'Date of Birth is required',
  validate: (value) => {
    if (!value) return 'Date of Birth is required';
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected >= today) return 'Date of Birth must be a past date';
    return true;
  }
};

// Generic required field
export const requiredField = (fieldName = 'Field') => ({
  required: {
    value: true,
    message: `${fieldName} is required`
  },
  validate: (value) => {
    if (typeof value === 'boolean') return true;
    if (value instanceof File) return true;

    const stringValue = value?.toString().trim();

    if (!stringValue) return `${fieldName} is required`;
    if (stringValue === '') return 'Empty space is not allowed';

    const numValue = Number(value);
    const isNumeric = !isNaN(numValue);

    if (isNumeric) {
      return numValue > 0 || `${fieldName} must be a positive number`;
    }
    return true;
  }
});

// Bundled access to all validation configs for easier imports
export const validationSchemas = {
  patterns,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  otp: otpSchema,
  ownerName: ownerNameSchema,
  phone: phoneSchema,
  categoryId: categoryIdSchema,
  businessName: businessNameSchema,
  storeName: storeNameSchema,
  pharmacyName: pharmacynameSchema,
  address: addressSchema,
  pincode: pincodeSchema,
  landmark: landmarkSchema,
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  openTime: openTimeSchema,
  closeTime: closeTimeSchema,
  holderName: holderNameSchema,
  bankName: bankNameSchema,
  swiftBic: swiftBicSchema,
  url: urlSchema,
  registrationNumber: registrationNumberSchema,
  taxIdentification: taxIdentificationSchema,
  documentUrl: documentUrlSchema,
  plotNo: plotNoSchema,
  floor: floorSchema,
  buildingName: buildingNameSchema,
  completeAddress: completeAddressSchema,
  dob: dobSchema,
  requiredField
};
