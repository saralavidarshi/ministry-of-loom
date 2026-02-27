import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../api/http";
import { useCart } from "../context/CartContext"; 

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("UK 6");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const res = await http.get("/products");
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

  const thumbnails = useMemo(() => {

    const url = product?.image_url;
    return url ? [url, url, url, url, url] : [];
  }, [product]);

  if (status === "loading") return <div style={{ padding: 40 }}>Loading...</div>;
  if (status === "error")
    return (
      <div style={{ padding: 40, color: "red" }}>
        {error}
      </div>
    );
  if (status === "notfound") return <div style={{ padding: 40 }}>Product not found</div>;

  const priceText = `$${Number(product.price).toFixed(2)}`;
   function handleAddToCart() {
    addToCart(product, qty); 
  }

  const styles = {
    page: { padding: "28px 20px" },
    shell: { maxWidth: 1200, margin: "0 auto" },

    topRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 14,
    },
    crumb: { fontSize: 12, color: "#777", letterSpacing: 0.2 },
    back: { fontSize: 12, color: "#111", textDecoration: "none" },

    grid: {
      display: "grid",
      gridTemplateColumns: "92px 1fr 420px",
      gap: 24,
      alignItems: "start",
    },

    thumbsCol: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    thumb: (active) => ({
      width: 84,
      height: 110,
      border: active ? "2px solid #111" : "1px solid #ddd",
      borderRadius: 6,
      overflow: "hidden",
      background: "#f6f6f6",
      cursor: "pointer",
    }),
    thumbImg: { width: "100%", height: "100%", objectFit: "cover" },

    imageWrap: {
      border: "1px solid #ddd",
      borderRadius: 8,
      overflow: "hidden",
      background: "#fafafa",
      minHeight: 560,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    mainImg: {
      width: "100%",
      height: "100%",
      maxHeight: 720,
      objectFit: "contain",
      display: "block",
    },

    right: {
      borderLeft: "1px solid #eee",
      paddingLeft: 18,
    },
    title: { margin: 0, fontSize: 20, letterSpacing: 0.5, fontWeight: 600 },
    sku: {
      marginTop: 10,
      display: "inline-block",
      fontSize: 11,
      padding: "6px 8px",
      borderRadius: 6,
      background: "#f3f3f3",
      color: "#444",
      letterSpacing: 0.6,
      textTransform: "uppercase",
    },
    price: { marginTop: 14, fontSize: 16, fontWeight: 600 },
    payLine: { marginTop: 6, fontSize: 12, color: "#666" },

    sectionLabel: {
      marginTop: 18,
      fontSize: 11,
      letterSpacing: 1.2,
      color: "#666",
      textTransform: "uppercase",
      fontWeight: 600,
    },

    sizeRow: { marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" },
    sizeBtn: (active) => ({
      padding: "8px 10px",
      borderRadius: 6,
      border: active ? "1px solid #111" : "1px solid #ddd",
      background: active ? "#111" : "#fff",
      color: active ? "#fff" : "#111",
      fontSize: 12,
      cursor: "pointer",
      minWidth: 54,
      textAlign: "center",
    }),
    sizeChart: {
      marginTop: 10,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12,
      color: "#444",
      textDecoration: "none",
    },

    colorRow: { marginTop: 10, display: "flex", alignItems: "center", gap: 10 },
    swatch: {
      width: 30,
      height: 30,
      borderRadius: 6,
      border: "1px solid #ddd",
      background: "#111",
    },

    qtyRow: { marginTop: 16, display: "grid", gridTemplateColumns: "120px 1fr", gap: 10 },
    qtyBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      border: "1px solid #ddd",
      borderRadius: 8,
      overflow: "hidden",
      height: 42,
    },
    qtyBtn: {
      width: 42,
      height: 42,
      border: "none",
      background: "#fff",
      cursor: "pointer",
      fontSize: 18,
    },
    qtyVal: { flex: 1, textAlign: "center", fontSize: 13 },

    addToCart: {
      height: 42,
      borderRadius: 8,
      border: "1px solid #111",
      background: "#111",
      color: "#fff",
      fontSize: 12,
      letterSpacing: 1.6,
      textTransform: "uppercase",
      cursor: "pointer",
    },
    buyNow: {
      marginTop: 10,
      height: 42,
      borderRadius: 8,
      border: "1px solid #111",
      background: "#fff",
      color: "#111",
      fontSize: 12,
      letterSpacing: 1.6,
      textTransform: "uppercase",
      cursor: "pointer",
      width: "100%",
    },

    metaList: { marginTop: 16, paddingLeft: 18, color: "#333", fontSize: 13, lineHeight: 1.7 },
    note: { marginTop: 12, fontSize: 12, color: "#666", lineHeight: 1.6 },
    stockLine: { marginTop: 12, fontSize: 12, color: "#111" },

  
    responsive: `
      @media (max-width: 1100px) {
        .pd-grid { grid-template-columns: 92px 1fr 360px; }
      }
      @media (max-width: 980px) {
        .pd-grid { grid-template-columns: 1fr; }
        .pd-right { border-left: none !important; padding-left: 0 !important; }
        .pd-thumbs { flex-direction: row !important; overflow-x: auto; padding-bottom: 6px; }
        .pd-thumb { width: 74px !important; height: 96px !important; }
        .pd-imageWrap { min-height: 420px !important; }
      }
    `,
  };

  return (
    <div style={styles.page}>
      <style>{styles.responsive}</style>

      <div style={styles.shell}>

        <div style={styles.topRow}>
          <Link to="/products" style={styles.back}>
            ← GO BACK
          </Link>

          <div style={styles.crumb}>
            HOME / PRODUCTS / <span style={{ color: "#111" }}>{product.name}</span>
          </div>

          <div />
        </div>

        <div className="pd-grid" style={styles.grid}>
          <div className="pd-thumbs" style={styles.thumbsCol}>
            {thumbnails.length > 0 ? (
              thumbnails.map((src, idx) => (
                <div key={idx} className="pd-thumb" style={styles.thumb(idx === 0)}>
                  <img src={src} alt={`${product.name} ${idx + 1}`} style={styles.thumbImg} />
                </div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: "#777" }}>No images</div>
            )}
          </div>
          <div className="pd-imageWrap" style={styles.imageWrap}>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                style={styles.mainImg}
                data-testid="product-image"
              />
            ) : (
              <div style={{ color: "#888", fontSize: 13 }}>No image available</div>
            )}
          </div>


          <div className="pd-right" style={styles.right}>
            <h1 style={styles.title} data-testid="product-title">
              {product.name}
            </h1>

            <div style={styles.sku}>
              {product.category ? `${product.category}` : "SKU"} • {product.id}
            </div>

            <div style={styles.price} data-testid="product-price">
              {priceText}
            </div>

            <div style={styles.payLine}>
              or 3 x {`$${(Number(product.price) / 3).toFixed(2)}`} with{" "}
              <b style={{ color: "#111" }}>KOKO</b> / <b style={{ color: "#111" }}>Mintpay</b>
            </div>

       
            <div style={styles.sectionLabel}>SIZE {selectedSize}</div>
            <div style={styles.sizeRow}>
              {["UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16"].map((s) => (
                <button
                  key={s}
                  type="button"
                  style={styles.sizeBtn(selectedSize === s)}
                  onClick={() => setSelectedSize(s)}
                >
                  {s.replace("UK ", "UK ")}
                </button>
              ))}
            </div>

            <a href="#" onClick={(e) => e.preventDefault()} style={styles.sizeChart}>
              <span style={{ fontSize: 14 }}>📏</span> Size Chart
            </a>

          
            <div style={styles.sectionLabel}>COLOR</div>
            <div style={styles.colorRow}>
              <div style={styles.swatch} />
              <div style={{ fontSize: 13, color: "#111" }}>{product.color || "Black"}</div>
            </div>

           
            <div style={styles.qtyRow}>
              <div style={styles.qtyBox}>
                <button
                  type="button"
                  style={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="decrease quantity"
                >
                  −
                </button>
                <div style={styles.qtyVal}>{qty}</div>
                <button
                  type="button"
                  style={styles.qtyBtn}
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="increase quantity"
                >
                  +
                </button>
              </div>

              <button type="button" style={styles.addToCart} 
              onClick={handleAddToCart}>
                ADD TO CART
              </button>
            </div>

            <button type="button" style={styles.buyNow}>
              BUY IT NOW
            </button>

         
            <ul style={styles.metaList}>
              <li>
                <b>Description:</b>{" "}
                <span data-testid="product-description">{product.description}</span>
              </li>
              <li>
                <b>Inventory:</b>{" "}
                <span data-testid="product-inventory">{product.inventory_count}</span>
              </li>
              <li>
                <b>Limited edition:</b>{" "}
                <span data-testid="product-limited">
                  {product.limited_edition ? "Yes" : "No"}
                </span>
              </li>
            </ul>

            <div style={styles.note}>
              Please bear in mind that the photo may be slightly different from the actual item due
              to lighting conditions or the display used to view.
            </div>

            <div style={styles.stockLine}>
              {Number(product.inventory_count) <= 1
                ? "⏱ Only 1 left in stock. Order soon."
                : Number(product.inventory_count) > 1
                ? `✓ In stock: ${product.inventory_count}`
                : "Out of stock"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}