import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const HomePage = lazy(() => import('../pages/HomePage'));
const BlogListPage = lazy(() => import('../pages/BlogListPage'));
const BlogDetailPage = lazy(() => import('../pages/BlogDetailPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const AiTimelinePage = lazy(() => import('../pages/AiTimelinePage'));
const RoadmapPage = lazy(() => import('../pages/RoadmapPage'));
const IssueBoardPage = lazy(() => import('../pages/IssueBoardPage'));
const MusingPage = lazy(() => import('../pages/MusingPage'));
const BookshelfPage = lazy(() => import('../pages/BookshelfPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const LoginPage = lazy(() => import('../pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const PostManagerPage = lazy(() => import('../pages/admin/PostManagerPage'));
const PostEditorPage = lazy(() => import('../pages/admin/PostEditorPage'));

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="public-layout">
    <Navbar />
    <main className="main-content">
      <Suspense fallback={<LoadingSpinner fullPage />}>{children}</Suspense>
    </main>
    <Footer />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout><HomePage /></PublicLayout>,
  },
  {
    path: '/blog',
    element: <PublicLayout><BlogListPage /></PublicLayout>,
  },
  {
    path: '/blog/:slug',
    element: <PublicLayout><BlogDetailPage /></PublicLayout>,
  },
  {
    path: '/about',
    element: <PublicLayout><AboutPage /></PublicLayout>,
  },
  {
    path: '/ai',
    element: <PublicLayout><AiTimelinePage /></PublicLayout>,
  },
  {
    path: '/roadmap',
    element: <PublicLayout><RoadmapPage /></PublicLayout>,
  },
  {
    path: '/issues',
    element: <PublicLayout><IssueBoardPage /></PublicLayout>,
  },
  {
    path: '/musings',
    element: <PublicLayout><MusingPage /></PublicLayout>,
  },
  {
    path: '/books',
    element: <PublicLayout><BookshelfPage /></PublicLayout>,
  },
  {
    path: '/admin/login',
    element: <Suspense fallback={<LoadingSpinner fullPage />}><LoginPage /></Suspense>,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<LoadingSpinner fullPage />}><DashboardPage /></Suspense> },
      { path: 'dashboard', element: <Suspense fallback={<LoadingSpinner fullPage />}><DashboardPage /></Suspense> },
      { path: 'posts', element: <Suspense fallback={<LoadingSpinner fullPage />}><PostManagerPage /></Suspense> },
      { path: 'posts/new', element: <Suspense fallback={<LoadingSpinner fullPage />}><PostEditorPage /></Suspense> },
      { path: 'posts/:id/edit', element: <Suspense fallback={<LoadingSpinner fullPage />}><PostEditorPage /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <PublicLayout><NotFoundPage /></PublicLayout>,
  },
]);
