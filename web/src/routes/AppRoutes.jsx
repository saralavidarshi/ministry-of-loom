import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage";

import CartPage from "../pages/CartPage";
import OrdersPage from "../pages/OrdersPage";
import AdminPage from "../pages/AdminPage";
import LoginPage from "../pages/LoginPage";
import ForbiddenPage from "../pages/ForbiddenPage";

export default function App() {
  return (
    <>
  

      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

      
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />


        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/products">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  );
}