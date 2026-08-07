import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/providers/ToastProvider';
import { AppRoutes } from './routes/app.routes';
import { useAppDispatch } from './hooks/useAppDispatch';
import { fetchCurrentUser } from './features/auth/auth.slice';

export const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return <AppRoutes />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
