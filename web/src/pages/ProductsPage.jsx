import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const [status, setStatus] = useState("loading");
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("new");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get("/products");
        setItems(res.data.items || []);
        setStatus("ready");
      } catch (e) {
        setStatus("error");
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let data = items.filter((p) => {
      if (!q) return true;
      return (
        (p.name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    });

    // Sorting
    const copy = [...data];
    if (sort === "price-asc") copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "price-desc") copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === "name") copy.sort((a, b) => String(a.name).localeCompare(String(b.name)));

 
    return copy;
  }, [items, query, sort]);

  if (status === "loading") return <div className="p-10">Loading...</div>;
  if (status === "error") return <div className="p-10">Failed to load products</div>;

  return (
    <div className="bg-white">
    
      <div className="w-full px-6 lg:px-16 py-10">
      
        <div className="border-b pb-6">
          <p className="text-[11px] tracking-[0.25em] text-neutral-500">
            HOME / NEW ARRIVALS
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-wide">NEW ARRIVALS</h1>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
            >
              Filters
            </button>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-72 max-w-full rounded border border-neutral-300 px-4 py-2 text-sm outline-none focus:border-neutral-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-neutral-500"
            >
              <option value="new">Date, New to Old</option>
              <option value="price-asc">Price, Low to High</option>
              <option value="price-desc">Price, High to Low</option>
              <option value="name">Name, A to Z</option>
            </select>
          </div>
        </div>

    
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group cursor-pointer"
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <div className="aspect-[3/4] w-full overflow-hidden border border-neutral-200 bg-neutral-50">
                <img
                  src={p.image_url || "https://via.placeholder.com/900x1200?text=No+Image"}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-[11px] tracking-[0.25em] text-neutral-500">
                  {(p.category || "COLLECTION").toUpperCase()}
                </p>

                <h3 className="line-clamp-1 text-sm font-medium text-neutral-900">
                  {p.name}
                </h3>

                <p className="text-sm font-semibold text-neutral-900">
                  ${Number(p.price ?? 0).toFixed(2)}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/products/${p.id}`);
                  }}
                  className="mt-1 inline-flex items-center text-sm font-medium text-neutral-900 underline underline-offset-4 hover:text-neutral-700"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6 text-sm text-neutral-500">
          Showing {filtered.length} products
        </div>
      </div>
    </div>
  );
}