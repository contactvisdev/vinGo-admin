import { createSlice } from '@reduxjs/toolkit';
import { getPersistedAuthData } from '../../services/auth';

const persistedAuth = getPersistedAuthData();

const initialState = {
  user: persistedAuth?.user || null,
  token: persistedAuth?.token || null,
  isAuthenticated: !!persistedAuth
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  }
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
