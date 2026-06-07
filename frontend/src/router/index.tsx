import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ScrollToTopButton } from '../components/ui/ScrollToTopButton';
import { ErrorBoundary } from '../components/ErrorBoundary';

const HomePage = lazy(() => import('../pages/HomePage'));
const BlogListPage = lazy(() => import('../pages/BlogListPage'));
const BlogDetailPage = lazy(() => import('../pages/BlogDetailPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const AiTimelinePage = lazy(() => import('../pages/AiTimelinePage'));
const RoadmapPage = lazy(() => import('../pages/RoadmapPage'));
const IssueBoardPage = lazy(() => import('../pages/IssueBoardPage'));
const MusingPage = lazy(() => import('../pages/MusingPage'));
const BookshelfPage = lazy(() => import('../pages/BookshelfPage'));
const PracticePage = lazy(() => import('../pages/PracticePage'));
const SitesPage = lazy(() => import('../pages/SitesPage'));
const AiLearningPage = lazy(() => import('../pages/AiLearningPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const LoginPage = lazy(() => import('../pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const PostManagerPage = lazy(() => import('../pages/admin/PostManagerPage'));
const PostEditorPage = lazy(() => import('../pages/admin/PostEditorPage'));
const TagManagerPage      = lazy(() => import('../pages/admin/TagManagerPage'));
const CategoryManagerPage = lazy(() => import('../pages/admin/CategoryManagerPage'));
const BookManagerPage     = lazy(() => import('../pages/admin/BookManagerPage'));
const IssueManagerPage    = lazy(() => import('../pages/admin/IssueManagerPage'));
const MusingManagerPage   = lazy(() => import('../pages/admin/MusingManagerPage'));
const PracticeManagerPage = lazy(() => import('../pages/admin/PracticeManagerPage'));
const RoadmapManagerPage  = lazy(() => import('../pages/admin/RoadmapManagerPage'));
const SiteManagerPage     = lazy(() => import('../pages/admin/SiteManagerPage'));

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <div className="public-layout">
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<LoadingSpinner fullPage />}>{children}</Suspense>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  </ErrorBoundary>
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
    path: '/practice',
    element: <PublicLayout><PracticePage /></PublicLayout>,
  },
  {
    path: '/sites',
    element: <PublicLayout><SitesPage /></PublicLayout>,
  },
  {
    path: '/ai-learning',
    element: <PublicLayout><AiLearningPage /></PublicLayout>,
  },
  {
    path: '/admin/login',
    element: <ErrorBoundary><Suspense fallback={<LoadingSpinner fullPage />}><LoginPage /></Suspense></ErrorBoundary>,
  },
  {
    path: '/admin',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <Suspense fallback={<LoadingSpinner fullPage />}><DashboardPage /></Suspense> },
      { path: 'dashboard', element: <Suspense fallback={<LoadingSpinner fullPage />}><DashboardPage /></Suspense> },
      { path: 'posts', element: <Suspense fallback={<LoadingSpinner fullPage />}><PostManagerPage /></Suspense> },
      { path: 'posts/new', element: <Suspense fallback={<LoadingSpinner fullPage />}><PostEditorPage /></Suspense> },
      { path: 'posts/:id/edit', element: <Suspense fallback={<LoadingSpinner fullPage />}><PostEditorPage /></Suspense> },
      { path: 'tags',       element: <Suspense fallback={<LoadingSpinner fullPage />}><TagManagerPage /></Suspense> },
      { path: 'categories', element: <Suspense fallback={<LoadingSpinner fullPage />}><CategoryManagerPage /></Suspense> },
      { path: 'books',      element: <Suspense fallback={<LoadingSpinner fullPage />}><BookManagerPage /></Suspense> },
      { path: 'issues',     element: <Suspense fallback={<LoadingSpinner fullPage />}><IssueManagerPage /></Suspense> },
      { path: 'musings',    element: <Suspense fallback={<LoadingSpinner fullPage />}><MusingManagerPage /></Suspense> },
      { path: 'practice',   element: <Suspense fallback={<LoadingSpinner fullPage />}><PracticeManagerPage /></Suspense> },
      { path: 'roadmap',    element: <Suspense fallback={<LoadingSpinner fullPage />}><RoadmapManagerPage /></Suspense> },
      { path: 'sites',      element: <Suspense fallback={<LoadingSpinner fullPage />}><SiteManagerPage /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <PublicLayout><NotFoundPage /></PublicLayout>,
  },
]);
