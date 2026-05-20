import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '../apiSlice';
import commonSlice from './commonSlice';
import authSlice from './authSlice';

const appReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authSlice,
  common: commonSlice
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});
