
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_KEY = "eol_cart";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => readCart());

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);


  const addToCart = (product, qty = 1) => {
    const quantityToAdd = Math.max(1, Number(qty) || 1);

    setCart((prev) => {
      const existing = prev.find((x) => x.id === product.id);

      if (existing) {
        return prev.map((x) =>
          x.id === product.id
            ? { ...x, quantity: x.quantity + quantityToAdd }
            : x
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image_url: product.image_url || "",
          quantity: quantityToAdd,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  };

  const updateQty = (id, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, quantity: q } : x)));
  };

  const clearCart = () => setCart([]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [cart]
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}