import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../api/http";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await http.get("/products"); // MVP: reuse existing endpoint
        const found = res.data.items.find((p) => p.id === id);

        if (!found) {
          setStatus("notfound");
          return;
        }

        setProduct(found);
        setStatus("ready");
      } catch (e) {
        setError("Failed to load product");
        setStatus("error");
      }
    }
    load();
  }, [id]);

  if (status === "loading") return <div style={{ padding: 40 }}>Loading...</div>;
  if (status === "error") return <div style={{ padding: 40, color: "red" }}>{error}</div>;
  if (status === "notfound") return <div style={{ padding: 40 }}>Product not found</div>;

  return (
    <div style={{ padding: 40 }}>
      <Link to="/products">← Back to products</Link>

      <h1 style={{ marginTop: 16 }} data-testid="product-title">{product.name}</h1>
      <p data-testid="product-description">{product.description}</p>

      <h2 data-testid="product-price">${Number(product.price).toFixed(2)}</h2>

      <p><b>Category:</b> <span data-testid="product-category">{product.category}</span></p>
      <p><b>Inventory:</b> <span data-testid="product-inventory">{product.inventory_count}</span></p>
      <p><b>Limited edition:</b> <span data-testid="product-limited">{product.limited_edition ? "Yes" : "No"}</span></p>

      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: 350, marginTop: 20, borderRadius: 10 }}
          data-testid="product-image"
        />
      )}
    </div>
  );
}