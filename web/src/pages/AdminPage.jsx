import { useEffect, useState } from "react";
import { http } from "../api/http";
import { adminCreateProduct, adminDeleteProduct } from "../api/adminProducts";

const emptyForm = {
  name: "",
  description: "",
  price: 0,
  category: "",
  inventory_count: 0,
  limited_edition: false,
  image_url: "",
};

export default function AdminPage() {
  const [status, setStatus] = useState("loading");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  async function loadProducts() {
    setError("");
    try {
      const res = await http.get("/products");
      setItems(res.data.items);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError("Failed to load products");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    try {
      const created = await adminCreateProduct({
        ...form,
        price: Number(form.price),
        inventory_count: Number(form.inventory_count),
      });

      setItems((prev) => [created, ...prev]);
      setForm(emptyForm);
    } catch (e) {
      setError(e?.response?.data?.error || "Create failed");
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await adminDeleteProduct(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e?.response?.data?.error || "Delete failed");
    }
  }

  if (status === "loading") return <div data-testid="admin-loading">Loading...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2 data-testid="admin-heading">Admin Dashboard</h2>

      {error && (
        <p data-testid="admin-error" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Create Product */}
      <h3 style={{ marginTop: 24 }}>Create Product</h3>
      <form onSubmit={handleCreate} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <input data-testid="admin-name" placeholder="Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input data-testid="admin-description" placeholder="Description"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <input data-testid="admin-price" type="number" step="0.01" placeholder="Price"
          value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />

        <input data-testid="admin-category" placeholder="Category"
          value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />

        <input data-testid="admin-inventory" type="number" placeholder="Inventory"
          value={form.inventory_count} onChange={(e) => setForm({ ...form, inventory_count: e.target.value })} />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            data-testid="admin-limited"
            type="checkbox"
            checked={form.limited_edition}
            onChange={(e) => setForm({ ...form, limited_edition: e.target.checked })}
          />
          Limited edition
        </label>

        <input data-testid="admin-image-url" placeholder="Image URL"
          value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />

        <button data-testid="admin-create-btn" type="submit">Create</button>
      </form>

      {/* Products table */}
      <h3 style={{ marginTop: 32 }}>Products</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", marginTop: 12 }}>
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>Category</th><th>Inventory</th><th>Limited</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} data-testid={`admin-row-${p.id}`}>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.category}</td>
              <td>{p.inventory_count}</td>
              <td>{p.limited_edition ? "Yes" : "No"}</td>
              <td>
                <button
                  data-testid={`admin-delete-${p.id}`}
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button style={{ marginTop: 16 }} onClick={loadProducts} data-testid="admin-refresh">
        Refresh
      </button>
    </div>
  );
}