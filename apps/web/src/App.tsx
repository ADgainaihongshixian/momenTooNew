import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const TimelinePage = lazy(() => import('@/features/timeline/pages/TimelinePage'));
const DiaryPage = lazy(() => import('@/features/diary/pages/DiaryPage'));
const AnniversaryPage = lazy(() => import('@/features/anniversary/pages/AnniversaryPage'));
const BindCouplePage = lazy(() => import('@/features/couple/pages/BindCouplePage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-moonWhite">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-starBlue border-t-transparent" />
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/bind-couple" element={<ProtectedRoute><BindCouplePage /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute><TimelinePage /></ProtectedRoute>} />
        <Route path="/diary" element={<ProtectedRoute><DiaryPage /></ProtectedRoute>} />
        <Route path="/anniversary" element={<ProtectedRoute><AnniversaryPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}