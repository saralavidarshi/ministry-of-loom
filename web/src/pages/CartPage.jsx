import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, total, removeFromCart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();

  async function handleCheckout() {
    try {
      const payload = cart.map((item) => ({
        product_id: item.id,
        qty: item.quantity,
      }));

      await createOrder(payload);

      clearCart();
      navigate("/orders"); // we will build this page next
    } catch (e) {
      alert(e?.response?.data?.error || "Checkout failed");
    }
  }

  if (cart.length === 0) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Cart</h2>

      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((x) => (
            <tr key={x.id}>
              <td>{x.name}</td>
              <td>${x.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={x.quantity}
                  onChange={(e) => updateQty(x.id, Number(e.target.value))}
                  style={{ width: 70 }}
                />
              </td>
              <td>${(x.price * x.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => removeFromCart(x.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 20 }}>Total: ${total.toFixed(2)}</h3>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={clearCart}>Clear cart</button>
        <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
}