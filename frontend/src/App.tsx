import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastContainer } from './components/ui/ToastContainer';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import './styles/globals.css';

const App: React.FC = () => (
  <>
    <RouterProvider router={router} />
    <ToastContainer />
    <ConfirmDialog />
  </>
);

export default App;
