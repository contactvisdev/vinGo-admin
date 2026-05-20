import { createRoot } from 'react-dom/client';

// styles
import './index.scss';

// project-imports
import App from './App';

import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/600.css';
import { Provider } from 'react-redux';
import ToastContainer from './components/ToastContainer';
import { store } from './store/slices/index';
import { setupAxiosInterceptors } from './services/api';

// Validate required environment variables
const requiredEnvVars = ['VITE_API_BASE_URL'];
requiredEnvVars.forEach((key) => {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

setupAxiosInterceptors(store);

const container = document.getElementById('root');
const root = createRoot(container);

// ==============================|| MAIN - REACT DOM RENDER ||============================== //

root.render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
);
