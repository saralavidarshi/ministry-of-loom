import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading"); 
  const [error, setError] = useState(""); 
  useEffect(() => {
    async function load() {
      try {
        setStatus("loading");
        const data = await getMyOrders();
        setOrders(data || []);
        setStatus("ready");
      } catch (e) {
        setError(e?.response?.data?.error || "Failed to load orders");
        setStatus("error");
      }
    }
    load();
  }, []);

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
      textTransform: "uppercase",
    },
    crumbLink: { color: "#777", textDecoration: "none" },

    headerRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 16,
    },
    title: { margin: 0, fontSize: 44, fontWeight: 600, letterSpacing: 0.2 },
    continue: {
      fontSize: 12,
      color: "#111",
      textDecoration: "none",
      letterSpacing: 1.2,
      textTransform: "uppercase",
    },

    tableWrap: {
      border: "1px solid #eee",
      borderRadius: 10,
      overflow: "hidden",
      background: "#fff",
    },
    tableHeader: {
      display: "grid",
      gridTemplateColumns: "2fr 0.8fr 0.8fr 1.2fr",
      gap: 18,
      padding: "12px 16px",
      background: "#fafafa",
      borderBottom: "1px solid #eee",
      fontSize: 11,
      letterSpacing: 1.2,
      color: "#777",
      textTransform: "uppercase",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "2fr 0.8fr 0.8fr 1.2fr",
      gap: 18,
      padding: "14px 16px",
      borderBottom: "1px solid #eee",
      alignItems: "center",
      fontSize: 13,
      color: "#111",
    },

    mono: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },

    // ✅ user-friendly order id
    orderRef: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    orderBadge: {
      fontSize: 11,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #ddd",
      background: "#f5f5f5",
      color: "#111",
      whiteSpace: "nowrap",
    },
    copyBtn: {
      border: "1px solid #ddd",
      background: "#fff",
      borderRadius: 999,
      padding: "6px 10px",
      fontSize: 11,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      cursor: "pointer",
      color: "#111",
      whiteSpace: "nowrap",
    },
    copied: {
      fontSize: 11,
      color: "#777",
      letterSpacing: 0.4,
      whiteSpace: "nowrap",
    },

    statusPill: (s) => {
      const normalized = String(s || "").toUpperCase();
      const isPending = normalized === "PENDING";
      const isPaid = normalized === "PAID";
      const isShipped = normalized === "SHIPPED";
      const isCancelled = normalized === "CANCELLED" || normalized === "CANCELED";

      const border = isPaid || isShipped ? "#111" : "#ddd";
      const bg = isCancelled ? "#fff5f5" : "#f5f5f5";
      const color = isCancelled ? "#a40000" : "#111";

      return {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${border}`,
        background: isPending ? "#f3f3f3" : bg,
        color,
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      };
    },

    empty: {
      border: "1px solid #eee",
      borderRadius: 10,
      padding: 18,
      background: "#fafafa",
      color: "#666",
      fontSize: 13,
      lineHeight: 1.6,
    },

    errorBox: {
      border: "1px solid #ffd6d6",
      background: "#fff5f5",
      color: "#a40000",
      borderRadius: 10,
      padding: 14,
      marginBottom: 14,
      fontSize: 13,
    },

    responsive: `
      @media (max-width: 900px) {
        .orders-head { display: none !important; }
        .orders-row { grid-template-columns: 1fr !important; gap: 8px !important; }
        .orders-row > div { display: flex; justify-content: space-between; gap: 10px; }
        .orders-row > div::before {
          content: attr(data-label);
          color: #777;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-size: 11px;
        }
      }
    `,
  };

  const rows = useMemo(() => orders || [], [orders]);


  const shortOrderId = (id) => `Order #${String(id || "").slice(-6).toUpperCase()}`;


  const [copiedId, setCopiedId] = useState("");

  async function copyFullId(id) {
    try {
      await navigator.clipboard.writeText(String(id));
      setCopiedId(String(id));
      window.setTimeout(() => setCopiedId(""), 1200);
    } catch {

    }
  }

  return (
    <div style={styles.page}>
      <style>{styles.responsive}</style>

      <div style={styles.shell}>
        <div style={styles.crumbRow}>
          <Link to="/" style={styles.crumbLink}>
            HOME
          </Link>
          &nbsp;/&nbsp;<span>MY ORDERS</span>
        </div>

        <div style={styles.headerRow}>
          <h1 style={styles.title}>My Orders</h1>

          <Link to="/products" style={styles.continue}>
            CONTINUE SHOPPING
          </Link>
        </div>

        {status === "error" && <div style={styles.errorBox}>{error}</div>}

        {status !== "error" && rows.length === 0 && (
          <div style={styles.empty}>
            No orders yet. Once you checkout, your orders will appear here.
          </div>
        )}

        {rows.length > 0 && (
          <div style={styles.tableWrap}>
            <div className="orders-head" style={styles.tableHeader}>
              <div>Order</div>
              <div>Status</div>
              <div>Total</div>
              <div>Date</div>
            </div>

            {rows.map((o) => (
              <div key={o.id} className="orders-row" style={styles.row}>
                <div data-label="Order">
                  <div style={styles.orderRef}>
                    <span style={{ ...styles.orderBadge, ...styles.mono }}>
                      {shortOrderId(o.id)}
                    </span>

                    <button
                      type="button"
                      style={styles.copyBtn}
                      onClick={() => copyFullId(o.id)}
                      title="Copy full Order ID"
                    >
                      Copy ID
                    </button>

                    {copiedId === String(o.id) && <span style={styles.copied}>Copied</span>}
                  </div>
                </div>

                <div data-label="Status">
                  <span style={styles.statusPill(o.status)}>{o.status}</span>
                </div>

                <div data-label="Total">${Number(o.total_amount).toFixed(2)}</div>

                <div data-label="Date">{new Date(o.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}