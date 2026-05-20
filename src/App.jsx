import { BrowserRouter, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthRoutes } from './routes/AuthRoutes';
import { ProtectedRoutes } from './routes/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {AuthRoutes}
          {ProtectedRoutes}
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
