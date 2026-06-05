import { Navigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'worker' | 'family')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { currentRole } = useStore();

  if (!allowedRoles.includes(currentRole as 'admin' | 'worker' | 'family')) {
    const firstAllowed: Record<string, string> = {
      admin: '/',
      worker: '/tasks',
      family: '/elderly'
    };
    return <Navigate to={firstAllowed[currentRole] || '/'} replace />;
  }

  return <>{children}</>;
}
