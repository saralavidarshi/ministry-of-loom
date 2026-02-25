import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
