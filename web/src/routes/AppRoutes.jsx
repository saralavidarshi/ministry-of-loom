import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";
import LoginPage from "../pages/LoginPage";
import AdminPage from "../pages/AdminPage";
import ProtectedRoute from "../components/ProtectedRoute";
import CartPage from "../pages/CartPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRole="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/products" replace />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
}