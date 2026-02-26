import { useEffect, useState } from "react";
import { http } from "../api/http";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminUpdateProduct,
} from "../api/adminProducts";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  inventory_count: "",
  limited_edition: false,
  image_url: "",
};

export default function AdminPage() {
  const [status, setStatus] = useState("loading");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function onEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: String(p.price ?? ""),
      category: p.category || "",
      inventory_count: String(p.inventory_count ?? ""),
      limited_edition: !!p.limited_edition,
      image_url: p.image_url || "",
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      price: Number(form.price),
      inventory_count: Number(form.inventory_count),
      image_url: form.image_url || "",
      limited_edition: !!form.limited_edition,
    };

    // basic guard
    if (!payload.name || !payload.category) {
      setError("Name and Category are required");
      return;
    }

    try {
      if (editingId) {
        const updated = await adminUpdateProduct(editingId, payload);
        setItems((prev) => prev.map((x) => (x.id === editingId ? updated : x)));
        resetForm();
      } else {
        const created = await adminCreateProduct(payload);
        setItems((prev) => [created, ...prev]);
        resetForm();
      }
    } catch (e) {
      setError(e?.response?.data?.error || (editingId ? "Update failed" : "Create failed"));
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await adminDeleteProduct(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    } catch (e) {
      setError(e?.response?.data?.error || "Delete failed");
    }
  }

  if (status === "loading") return <div data-testid="admin-loading">Loading...</div>;
  if (status === "error") return <div data-testid="admin-error-page">Error loading admin</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2 data-testid="admin-heading">Admin Dashboard</h2>

      {error && (
        <p data-testid="admin-error" style={{ color: "red" }}>
          {error}
        </p>
      )}

      <h3 style={{ marginTop: 24 }}>{editingId ? "Edit Product" : "Create Product"}</h3>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <input
          data-testid="admin-name"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          data-testid="admin-description"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          data-testid="admin-price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          data-testid="admin-category"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          data-testid="admin-inventory"
          type="number"
          placeholder="Inventory"
          value={form.inventory_count}
          onChange={(e) => setForm({ ...form, inventory_count: e.target.value })}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            data-testid="admin-limited"
            type="checkbox"
            checked={form.limited_edition}
            onChange={(e) => setForm({ ...form, limited_edition: e.target.checked })}
          />
          Limited edition
        </label>

        <input
          data-testid="admin-image-url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button data-testid="admin-submit-btn" type="submit">
            {editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button data-testid="admin-cancel-btn" type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 style={{ marginTop: 32 }}>Products</h3>

      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: "collapse", width: "100%", marginTop: 12 }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Inventory</th>
            <th>Limited</th>
            <th>Action</th>
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
              <td style={{ display: "flex", gap: 10 }}>
                <button data-testid={`admin-edit-${p.id}`} onClick={() => onEdit(p)}>
                  Edit
                </button>
                <button data-testid={`admin-delete-${p.id}`} onClick={() => handleDelete(p.id)}>
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