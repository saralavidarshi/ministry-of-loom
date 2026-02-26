import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const isLoggedIn = !!token;
  const isAdmin = role === "ADMIN";
  const isCustomer = role === "CUSTOMER";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 20px",
        borderBottom: "1px solid #ddd",
      }}
      data-testid="navbar"
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        {!isAdmin && (
          <Link to="/products" data-testid="nav-products">
            Products
          </Link>
        )}

        {isAdmin && (
          <Link to="/admin" data-testid="nav-admin">
            Admin
          </Link>
        )}
      </div>

      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        {isLoggedIn && isCustomer && (
          <>
            <Link to="/cart" data-testid="nav-cart">
              Cart ({cartCount})
            </Link>
            <Link to="/orders" data-testid="nav-orders">
              Orders
            </Link>
          </>
        )}

        {/* Auth */}
        {isLoggedIn ? (
          <>
            <span data-testid="nav-user">
              {email} ({role})
            </span>
            <button onClick={logout} data-testid="nav-logout">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" data-testid="nav-login">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}