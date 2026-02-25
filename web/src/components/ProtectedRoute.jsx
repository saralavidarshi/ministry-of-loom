import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && role !== requireRole) {
    return (
      <div style={{ padding: 40 }}>
        <h2 data-testid="forbidden-title">Forbidden</h2>
        <p data-testid="forbidden-message">You don’t have access to this page.</p>
      </div>
    );
  }

  return children;
}