import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import AuthPage from "@/pages/AuthPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
  allowedRoles?: Array<'patient' | 'doctor' | 'admin' | 'staff'>;
}

export const ProtectedRoute = ({ 
  children, 
  requireVerification = false,
  allowedRoles 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated || !user) {
    return <AuthPage />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 w-fit mx-auto">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You don't have permission to access this page. Your current role is <strong>{user.role}</strong>.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Required roles: {allowedRoles.join(', ')}
          </p>
        </div>
      </div>
    );
  }

  // Check verification requirements
  if (requireVerification && (!user.isEmailVerified || !user.isPhoneVerified)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/20 w-fit mx-auto">
            <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Required</h2>
          <div className="space-y-2">
            {!user.isEmailVerified && (
              <p className="text-gray-600 dark:text-gray-300">
                ❌ Email verification required
              </p>
            )}
            {!user.isPhoneVerified && (
              <p className="text-gray-600 dark:text-gray-300">
                ❌ Phone verification required
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please verify your account to access this feature.
          </p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};