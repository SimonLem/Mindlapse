import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<{ items: any[]; total: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/api/v1/products", {
        params: { page: 1, pageSize: 10, inStock: true },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err?.response?.status === 401)
          navigate("/login", { replace: true });
        else setError(err?.message ?? "Failed to load products");
      });
  }, [navigate]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!data) return <div className="p-4">Loading…</div>;
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Droïdes</h2>
      <div className="text-sm opacity-70 mb-4">Total: {data.total}</div>
      <ul className="space-y-2">
        {data.items.map((p) => (
          <li key={p.id} className="rounded border p-3">
            <div className="font-medium">
              {p.name} <span className="opacity-60">({p.type})</span>
            </div>
            <div className="text-sm opacity-80">{p.description}</div>
            <div className="text-sm mt-1">
              Prix: {p.price} • Stock: {p.stock}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
