import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import { useCart } from "../context/CartContext";

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts();
        setItems(data);
      } catch (e) {
        setError(e?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div data-testid="loading-spinner">Loading...</div>;
  if (error) return <div data-testid="toast-error">{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Embassy of Loom</h1>

      <input
        data-testid="search-input"
        placeholder="Search..."
        style={{ padding: 10, width: 280, margin: "16px 0" }}
      />

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        {items.map((p) => (
          <div
            key={p.id}
            data-testid={`product-card-${p.id}`}
            style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}
          >
            <h3>{p.name}</h3>
            <p style={{ opacity: 0.8 }}>{p.description}</p>
            <p><b>${p.price}</b></p>
            <p>{p.category}</p>

            <button data-testid={`product-open-${p.id}`}>View</button>
            <button onClick={() => addToCart(p)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
