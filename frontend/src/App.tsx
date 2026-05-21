import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastContainer } from './components/ui/ToastContainer';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { checkAuth } from './api/auth';
import { useAuthStore } from './store/authStore';
import './styles/globals.css';

const App: React.FC = () => {
  const { setChecked } = useAuthStore();

  useEffect(() => {
    checkAuth()
      .then((res) => setChecked(true, res.data.username))
      .catch(() => setChecked(false));
  }, [setChecked]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      <ConfirmDialog />
    </>
  );
};

export default App;
