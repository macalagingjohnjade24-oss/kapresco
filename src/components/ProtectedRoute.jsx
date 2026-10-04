import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingState from "./ui/LoadingState.jsx";

/**
 * Route guard backed by the real Supabase session.
 *
 * Waits for the persisted session to be restored before deciding — otherwise a
 * signed-in user would be bounced to /login on the first paint of a refresh.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initialised } = useAuth();
  const location = useLocation();

  if (!initialised) {
    return <LoadingState title="Checking your session…" description="Hang tight — one moment." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
