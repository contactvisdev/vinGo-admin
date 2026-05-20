export const login = (token, next) => {
  try {
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    next();
  } catch {
    return false;
  }
};

export const isAuthenticated = () => {
  try {
    if (typeof window == 'undefined') {
      return false;
    }
    if (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const authenticate = (accessToken, rememberMe, next) => {
  if (typeof window !== 'undefined') {
    if (rememberMe === 'true' || rememberMe === true) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      sessionStorage.setItem('accessToken', accessToken);
    }
    next();
  }
};

export const logout = (next) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userData');
    if (next) {
      next();
    }
  }
};

// Helper function to get persisted auth data for Redux hydration
export const getPersistedAuthData = () => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');

    if (token && userData) {
      return {
        token,
        user: JSON.parse(userData),
        isAuthenticated: true
      };
    }
    return null;
  } catch {
    return null;
  }
};
