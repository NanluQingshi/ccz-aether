import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './router';
import { ToastContainer } from './components/ui/ToastContainer';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import './styles/globals.css';

const App: React.FC = () => (
  <HelmetProvider>
    <RouterProvider router={router} />
    <ToastContainer />
    <ConfirmDialog />
  </HelmetProvider>
);

export default App;
