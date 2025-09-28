import { Navigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) return <p style={{ padding: 24 }}>Checking auth…</p>;
  if (!isAuthenticated) {
    // bounce to home, preserve where they were going
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}
