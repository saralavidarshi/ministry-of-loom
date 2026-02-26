import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";
import { useNavigate, Link } from "react-router-dom";

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
      navigate("/orders");
    } catch (e) {
      alert(e?.response?.data?.error || "Checkout failed");
    }
  }

  const styles = {
    page: { padding: "28px 20px" },
    shell: { maxWidth: 1200, margin: "0 auto" },

    crumbRow: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 22,
      fontSize: 12,
      color: "#777",
      letterSpacing: 0.4,
    },
    crumbLink: { color: "#777", textDecoration: "none" },

    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 420px",
      gap: 28,
      alignItems: "start",
    },

    titleRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 14,
    },
    title: { margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: 0.2 },
    continue: { fontSize: 12, color: "#111", textDecoration: "none" },

    tableHeader: {
      display: "grid",
      gridTemplateColumns: "1.6fr 0.7fr 0.9fr 0.7fr",
      gap: 18,
      padding: "10px 0",
      borderBottom: "1px solid #eee",
      fontSize: 11,
      letterSpacing: 1.2,
      color: "#777",
      textTransform: "uppercase",
    },

    row: {
      display: "grid",
      gridTemplateColumns: "1.6fr 0.7fr 0.9fr 0.7fr",
      gap: 18,
      padding: "18px 0",
      borderBottom: "1px solid #eee",
      alignItems: "center",
    },

    productCell: { display: "flex", gap: 14, alignItems: "center" },
    imgWrap: {
      width: 92,
      height: 120,
      borderRadius: 8,
      border: "1px solid #eee",
      background: "#f7f7f7",
      overflow: "hidden",
      flex: "0 0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

    name: { fontSize: 13, fontWeight: 600, letterSpacing: 0.3, marginBottom: 4 },
    meta: { fontSize: 12, color: "#777" },

    money: { fontSize: 13, color: "#111" },

    qtyWrap: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    qtyBox: {
      width: 120,
      height: 34,
      border: "1px solid #e5e5e5",
      borderRadius: 8,
      display: "flex",
      overflow: "hidden",
      background: "#fff",
    },
    qtyBtn: {
      width: 38,
      border: "none",
      background: "#fff",
      cursor: "pointer",
      fontSize: 16,
      color: "#111",
    },
    qtyVal: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      color: "#111",
      userSelect: "none",
    },
    qtyHiddenInput: {
      position: "absolute",
      opacity: 0,
      pointerEvents: "none",
      width: 1,
      height: 1,
    },
    deleteBtn: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontSize: 12,
      color: "#777",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      padding: 0,
    },

    // Right summary
    card: {
      border: "1px solid #eee",
      borderRadius: 10,
      background: "#fafafa",
      padding: 18,
      position: "sticky",
      top: 20,
    },
    freeShip: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      paddingBottom: 12,
      borderBottom: "2px solid #111",
      marginBottom: 16,
      fontSize: 12,
      color: "#111",
    },
    subRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginTop: 12,
      marginBottom: 16,
    },
    subLabel: { fontSize: 22, fontWeight: 500 },
    subValue: { fontSize: 18, fontWeight: 600 },

    accord: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 0",
      borderTop: "1px solid #e9e9e9",
      borderBottom: "1px solid #e9e9e9",
      fontSize: 13,
      color: "#111",
    },
    plus: { fontSize: 18, color: "#777" },

    checkout: {
      width: "100%",
      height: 44,
      borderRadius: 8,
      border: "1px solid #111",
      background: "#111",
      color: "#fff",
      fontSize: 12,
      letterSpacing: 1.8,
      textTransform: "uppercase",
      cursor: "pointer",
      marginTop: 16,
    },

    
    actions: { display: "flex", gap: 12, marginTop: 14 },
    secondaryBtn: {
      width: "100%",
      height: 44,
      borderRadius: 8,
      border: "1px solid #111",
      background: "#fff",
      color: "#111",
      cursor: "pointer",
      fontSize: 12,
      letterSpacing: 1.8,
      textTransform: "uppercase",
      cursor: "pointer",
      marginTop: 16,
    },

    emptyWrap: { padding: 40, maxWidth: 900, margin: "0 auto" },
    emptyTitle: { margin: 0, fontSize: 34, fontWeight: 600 },
    emptyText: { marginTop: 10, color: "#666" },

    responsive: `
      @media (max-width: 980px) {
        .cart-grid { grid-template-columns: 1fr; }
        .cart-card { position: static !important; }
        .cart-header { display: none !important; }
        .cart-row { grid-template-columns: 1fr !important; gap: 10px !important; }
        .cart-money { display: flex; justify-content: space-between; }
      }
    `,
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyWrap}>
        <h2 style={styles.emptyTitle}>Your cart</h2>
        <p style={styles.emptyText}>Your cart is empty.</p>
        <div style={{ marginTop: 20 }}>
          <Link to="/products" style={styles.secondaryBtn}>
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }


  const freeShippingThreshold = 5500;
  const qualifiesFreeShipping = total >= freeShippingThreshold;

  return (
    <div style={styles.page}>
      <style>{styles.responsive}</style>

      <div style={styles.shell}>
        <div style={styles.crumbRow}>
          <Link to="/" style={styles.crumbLink}>
            HOME
          </Link>
          &nbsp;/&nbsp;<span>YOUR SHOPPING CART</span>
        </div>

        <div className="cart-grid" style={styles.grid}>
          {/* LEFT: Items */}
          <div>
            <div style={styles.titleRow}>
              <h1 style={styles.title}>
                Your cart<sup style={{ fontSize: 14, marginLeft: 6 }}>{cart.length}</sup>
              </h1>

              <Link to="/products" style={styles.continue}>
                CONTINUE SHOPPING
              </Link>
            </div>

            <div className="cart-header" style={styles.tableHeader}>
              <div>Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div style={{ textAlign: "right" }}>Total</div>
            </div>

            {cart.map((x) => {
              const lineTotal = x.price * x.quantity;

              return (
                <div key={x.id} className="cart-row" style={styles.row}>
                  {/* Product */}
                  <div style={styles.productCell}>
                    <div style={styles.imgWrap}>
                      {x.image_url ? (
                        <img src={x.image_url} alt={x.name} style={styles.img} />
                      ) : (
                        <div style={{ fontSize: 12, color: "#888" }}>No image</div>
                      )}
                    </div>

                    <div>
                      <div style={styles.name}>{x.name}</div>
                      <div style={styles.meta}>UK 6 &nbsp;•&nbsp; Black</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="cart-money" style={styles.money}>
                    ${x.price.toFixed(2)}
                  </div>

                  {/* Qty + Delete */}
                  <div style={styles.qtyWrap}>
                    {/* Keep functionality: updateQty */}
                    <div style={{ position: "relative" }}>
                      {/* hidden input preserves your original "type number" behavior (keyboard) */}
                      <input
                        type="number"
                        min="1"
                        value={x.quantity}
                        onChange={(e) => updateQty(x.id, Number(e.target.value))}
                        style={styles.qtyHiddenInput}
                      />

                      <div style={styles.qtyBox}>
                        <button
                          type="button"
                          style={styles.qtyBtn}
                          onClick={() => updateQty(x.id, Math.max(1, x.quantity - 1))}
                          aria-label="decrease quantity"
                        >
                          −
                        </button>
                        <div style={styles.qtyVal}>{x.quantity}</div>
                        <button
                          type="button"
                          style={styles.qtyBtn}
                          onClick={() => updateQty(x.id, x.quantity + 1)}
                          aria-label="increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      style={styles.deleteBtn}
                      onClick={() => removeFromCart(x.id)}
                    >
                      DELETE
                    </button>
                  </div>

                  <div style={{ ...styles.money, textAlign: "right" }}>
                    ${lineTotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-card" style={styles.card}>
            <div style={styles.freeShip}>
              <span>🛍️</span>
              <span>
                {qualifiesFreeShipping
                  ? "Congrats! You're qualified for free shipping!"
                  : `Add $${(freeShippingThreshold - total).toFixed(
                      2
                    )} more to qualify for free shipping`}
              </span>
            </div>

            <div style={styles.subRow}>
              <div style={styles.subLabel}>Subtotal</div>
              <div style={styles.subValue}>${total.toFixed(2)}</div>
            </div>

            <div style={styles.accord}>
              <span>Order note</span>
              <span style={styles.plus}>+</span>
            </div>

            <button type="button" style={styles.checkout} onClick={handleCheckout}>
              CHECKOUT
            </button>
                   <button type="button" style={styles.secondaryBtn} onClick={clearCart}>
                CLEAR CART
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}