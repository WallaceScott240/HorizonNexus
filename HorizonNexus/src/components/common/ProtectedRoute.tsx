import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { JSX } from 'react';
import type { UserRole } from '../../types';

// Define the props for the component, now including allowedRoles
interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: UserRole[]; // Optional: If not provided, just checks for authentication
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { userProfile, isLoading } = useAuth();

  // Show a loading indicator while checking auth status
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If there's no user, redirect to the login page
  if (!userProfile) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is provided, check if the user's role is in the array
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userProfile.role)) {
    // User does not have the required role, redirect them.
    // Redirecting to the homepage is a safe default.
    return <Navigate to="/" />;
  }

  // If the user is authenticated and has the required role (or no role was required), render the component
  return children;
}