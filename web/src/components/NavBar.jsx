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

    <div>
      {<header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold tracking-widest">MINISTRY OF LOOM</div>

          <nav className="hidden items-center gap-6 text-xs tracking-widest text-gray-700 md:flex">
      {!isAdmin && (
          <Link to="/products" data-testid="nav-products">
            PRODUCTS
          </Link>
        )}

            {isLoggedIn && isCustomer && (
              <>
                <Link to="/cart" data-testid="nav-cart">
                  CART ({cartCount})
                </Link>
                <Link to="/orders" data-testid="nav-orders">
                  ORDERS
                </Link>
              </>
            )}

          {isLoggedIn ? (
            <>
              <span data-testid="nav-user">
                {email} ({role})
              </span>
              <button onClick={logout} data-testid="nav-logout">
                LOGOUT
              </button>
            </>
          ) : (
              <Link className="hover:text-black" to="/login">LOGIN</Link>
          )}



          </nav>
        
         </div>
      </header>}


    </div>

  );
}