import { useEffect, useMemo, useState } from "react";
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

  const isEditing = !!editingId;

  async function loadProducts() {
    setError("");
    try {
      const res = await http.get("/products");
      setItems(res.data.items || []);
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
      setError(
        e?.response?.data?.error || (editingId ? "Update failed" : "Create failed")
      );
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

  const stats = useMemo(() => {
    const total = items.length;
    const limited = items.filter((x) => x.limited_edition).length;
    const stock = items.reduce((sum, x) => sum + (Number(x.inventory_count) || 0), 0);
    return { total, limited, stock };
  }, [items]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div style={{ fontSize: 12, color: "#666", letterSpacing: 1.2, textTransform: "uppercase" }}>
          Loading admin…
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div
          style={{
            border: "1px solid #ffd6d6",
            background: "#fff5f5",
            color: "#a40000",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 13,
          }}
        >
          Error loading admin
        </div>
      </div>
    );
  }

  const styles = {
    page: { padding: "28px 20px", background: "#fff", minHeight: "100vh" },
    shell: { maxWidth: 1200, margin: "0 auto" },

    crumbRow: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 22,
      fontSize: 12,
      color: "#777",
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },

    headerRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 10,
    },
    titleWrap: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
    title: { margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: 0.2 },
    modePill: (editing) => ({
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #ddd",
      background: editing ? "#fff" : "#f5f5f5",
      color: "#111",
      fontSize: 11,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }),
    sub: { marginTop: 4, fontSize: 13, color: "#666", lineHeight: 1.5 },

    topActions: { display: "flex", gap: 10, flexWrap: "wrap" },
    btn: {
      height: 40,
      borderRadius: 8,
      border: "1px solid #111",
      background: "#fff",
      color: "#111",
      fontSize: 12,
      letterSpacing: 1.4,
      textTransform: "uppercase",
      padding: "0 14px",
      cursor: "pointer",
    },
    btnPrimary: {
      height: 40,
      borderRadius: 8,
      border: "1px solid #111",
      background: "#111",
      color: "#fff",
      fontSize: 12,
      letterSpacing: 1.6,
      textTransform: "uppercase",
      padding: "0 14px",
      cursor: "pointer",
    },
    btnDanger: {
      height: 32,
      borderRadius: 999,
      border: "1px solid #ddd",
      background: "#fff",
      color: "#111",
      fontSize: 11,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      padding: "0 12px",
      cursor: "pointer",
    },

    stats: {
      marginTop: 18,
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 14,
    },
    statCard: {
      border: "1px solid #eee",
      borderRadius: 10,
      padding: 16,
      background: "#fff",
    },
    statLabel: { fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#777" },
    statVal: { marginTop: 6, fontSize: 26, fontWeight: 600, color: "#111" },

    errorBox: {
      marginTop: 16,
      border: "1px solid #ffd6d6",
      background: "#fff5f5",
      color: "#a40000",
      borderRadius: 10,
      padding: "12px 14px",
      fontSize: 13,
    },

    grid: {
      marginTop: 18,
      display: "grid",
      gridTemplateColumns: "420px 1fr",
      gap: 22,
      alignItems: "start",
    },

    card: {
      border: "1px solid #eee",
      borderRadius: 10,
      background: "#fff",
      overflow: "hidden",
    },
    cardHead: { padding: 16, borderBottom: "1px solid #eee" },
    cardTitle: { margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: 0.2, color: "#111" },
    cardSub: { marginTop: 6, fontSize: 13, color: "#666", lineHeight: 1.5 },

    formBody: { padding: 16, display: "grid", gap: 14 },
    label: { fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#777" },
    input: {
      width: "100%",
      height: 40,
      borderRadius: 8,
      border: "1px solid #e5e5e5",
      padding: "0 12px",
      fontSize: 13,
      outline: "none",
    },
    inputArea: {
      width: "100%",
      height: 40,
      borderRadius: 8,
      border: "1px solid #e5e5e5",
      padding: "0 12px",
      fontSize: 13,
      outline: "none",
    },
    twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },

    checkRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#111" },
    checkbox: { width: 16, height: 16 },

    tableWrap: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: {
      textAlign: "left",
      padding: "12px 16px",
      fontSize: 11,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      color: "#777",
      background: "#fafafa",
      borderBottom: "1px solid #eee",
      whiteSpace: "nowrap",
    },
    td: { padding: "14px 16px", borderBottom: "1px solid #eee", verticalAlign: "top" },

    name: { fontWeight: 600, color: "#111" },
    desc: { marginTop: 4, fontSize: 12, color: "#777", lineHeight: 1.4 },

    pill: (variant) => {
      const base = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #ddd",
        background: "#f5f5f5",
        color: "#111",
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      };
      if (variant === "limited") return { ...base, border: "1px solid #111", background: "#111", color: "#fff" };
      if (variant === "low") return { ...base, background: "#fff5f5", color: "#a40000" };
      return base;
    },

    rowActions: { display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" },

    footer: {
      padding: "12px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      borderTop: "1px solid #eee",
      background: "#fff",
    },
    footerText: { fontSize: 12, color: "#777" },

    responsive: `
      @media (max-width: 980px) {
        .admin-grid { grid-template-columns: 1fr !important; }
        .admin-stats { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 520px) {
        .admin-two { grid-template-columns: 1fr !important; }
      }
    `,
  };

  return (
    <div style={styles.page}>
      <style>{styles.responsive}</style>

      <div style={styles.shell}>
        <div style={styles.crumbRow}>HOME / ADMIN</div>

        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <div style={styles.titleWrap}>
              <h1 style={styles.title}>Admin Dashboard</h1>
              <span style={styles.modePill(isEditing)}>{isEditing ? "Edit mode" : "Create mode"}</span>
            </div>
            <p style={styles.sub}>Manage products, stock, and limited editions.</p>
          </div>

          <div style={styles.topActions}>

            {isEditing && (
              <button
                onClick={resetForm}
                style={styles.btn}
                data-testid="admin-cancel-top"
                type="button"
              >
                Cancel edit
              </button>
            )}
          </div>
        </div>

        <div className="admin-stats" style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Products</div>
            <div style={styles.statVal}>{stats.total}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Limited Editions</div>
            <div style={styles.statVal}>{stats.limited}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Stock</div>
            <div style={styles.statVal}>{stats.stock}</div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div data-testid="admin-error" style={styles.errorBox}>
            {error}
          </div>
        )}

        <div className="admin-grid" style={styles.grid}>
          {/* Form card */}
          <div style={styles.card}>
            <div style={styles.cardHead}>
              <h2 style={styles.cardTitle}>{isEditing ? "Edit Product" : "Create Product"}</h2>
              <p style={styles.cardSub}>
                {isEditing ? "Update product details and stock." : "Add a new product to your catalog."}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.formBody}>
              <div>
                <div style={styles.label}>Name *</div>
                <input
                  data-testid="admin-name"
                  style={styles.input}
                  placeholder="Luxury Velvet Cape"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <div style={styles.label}>Description</div>
                <input
                  data-testid="admin-description"
                  style={styles.inputArea}
                  placeholder="Premium velvet statement piece"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="admin-two" style={styles.twoCol}>
                <div>
                  <div style={styles.label}>Price</div>
                  <input
                    data-testid="admin-price"
                    style={styles.input}
                    type="number"
                    step="0.01"
                    placeholder="399.99"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>

                <div>
                  <div style={styles.label}>Inventory</div>
                  <input
                    data-testid="admin-inventory"
                    style={styles.input}
                    type="number"
                    placeholder="10"
                    value={form.inventory_count}
                    onChange={(e) => setForm({ ...form, inventory_count: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div style={styles.label}>Category *</div>
                <input
                  data-testid="admin-category"
                  style={styles.input}
                  placeholder="Luxury / Batik / Linen"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>

              <div>
                <div style={styles.label}>Image URL</div>
                <input
                  data-testid="admin-image-url"
                  style={styles.input}
                  placeholder="https://…"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
              </div>

              <label style={styles.checkRow}>
                <input
                  data-testid="admin-limited"
                  type="checkbox"
                  style={styles.checkbox}
                  checked={form.limited_edition}
                  onChange={(e) => setForm({ ...form, limited_edition: e.target.checked })}
                />
                Limited edition
              </label>

              <div style={{ display: "flex", gap: 10, paddingTop: 2, flexWrap: "wrap" }}>
                <button data-testid="admin-submit-btn" type="submit" style={styles.btnPrimary}>
                  {isEditing ? "Update" : "Create"}
                </button>

                {isEditing && (
                  <button
                    data-testid="admin-cancel-btn"
                    type="button"
                    onClick={resetForm}
                    style={styles.btn}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHead}>
              <h2 style={styles.cardTitle}>Products</h2>
              <p style={styles.cardSub}>Edit or delete products from the catalog.</p>
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Inventory</th>
                    <th style={styles.th}>Limited</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((p) => {
                    const inv = Number(p.inventory_count) || 0;
                    return (
                      <tr key={p.id} data-testid={`admin-row-${p.id}`}>
                        <td style={styles.td}>
                          <div style={styles.name}>{p.name}</div>
                          {p.description ? <div style={styles.desc}>{p.description}</div> : null}
                        </td>

                        <td style={styles.td}>${Number(p.price).toFixed(2)}</td>

                        <td style={styles.td}>{p.category}</td>

                        <td style={styles.td}>
                          <span style={styles.pill(inv <= 3 ? "low" : "ok")}>{p.inventory_count}</span>
                        </td>

                        <td style={styles.td}>
                          <span style={styles.pill(p.limited_edition ? "limited" : "ok")}>
                            {p.limited_edition ? "Yes" : "No"}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <div style={styles.rowActions}>
                            <button
                              data-testid={`admin-edit-${p.id}`}
                              onClick={() => onEdit(p)}
                              style={styles.btnDanger}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              data-testid={`admin-delete-${p.id}`}
                              onClick={() => handleDelete(p.id)}
                              style={styles.btnDanger}
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {items.length === 0 && (
                    <tr>
                      <td style={{ ...styles.td, padding: 22, textAlign: "center", color: "#777" }} colSpan={6}>
                        No products yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={styles.footer}>
              <div style={styles.footerText}>
                Showing <b>{items.length}</b> products
              </div>
              <button onClick={loadProducts} style={styles.btn} type="button">
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}