import React from "react";
import api from "@/lib/api";
import type { Droid } from "@repo/types";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

/** Filtres centralisés dans le context */
export type StockFilter = "ALL" | "IN" | "OUT";
export type Filters = {
  name: string; // texte libre
  priceMin: string; // string pour binder l'<Input />
  priceMax: string; // idem
  stock: StockFilter;
};

const DEFAULT_FILTERS: Filters = {
  name: "",
  priceMin: "",
  priceMax: "",
  stock: "ALL",
};

const FILTERS_STORAGE_KEY = "droid_filters_v1";

type Query = { page?: number; pageSize?: number };

type ContextValue = {
  droids: Droid[]; // liste brute depuis l’API
  filteredDroids: Droid[]; // liste filtrée côté client
  total: number; // total brut (meta côté API)
  loading: boolean;
  error: string | null;

  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  resetFilters: () => void;

  reload: (params?: Query) => Promise<void>;
  createDroid: (payload: any) => Promise<any>;
  updateDroid: (id: number, payload: any) => Promise<any>;
  deleteDroid: (droidOrId: number | { id: number }) => Promise<void>;
};

const DroidCatalogContext = React.createContext<ContextValue | null>(null);

export function DroidCatalogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [droids, setDroids] = React.useState<Droid[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Pagination/params serveur (la recherche se fait en client ici)
  const [lastQuery, setLastQuery] = React.useState<Query>({
    page: 1,
    pageSize: 10,
  });

  // Filtres centralisés + persistance localStorage
  const [filters, setFilters] = useLocalStorage<Filters>(
    FILTERS_STORAGE_KEY,
    DEFAULT_FILTERS
  );

  const resetFilters = React.useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, [setFilters]);

  const reload = React.useCallback(
    async (params?: Query) => {
      setLoading(true);
      try {
        const query = { ...lastQuery, ...(params || {}) };
        const res = await api.get<any>("/api/v1/droids", { params: query });

        const data = res?.data;
        if (Array.isArray(data)) {
          setDroids(data as Droid[]);
          setTotal(data.length);
        } else {
          setDroids((data?.items ?? []) as Droid[]);
          setTotal(Number(data?.total ?? 0));
        }

        setLastQuery(query);
        setError(null);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || e?.message || "Failed to load droids"
        );
      } finally {
        setLoading(false);
      }
    },
    [lastQuery]
  );

  const createDroid = React.useCallback(
    async (payload: any) => {
      const res = await api.post<any>("/api/v1/droids", payload, {
        headers: { "Content-Type": "application/json" },
      });
      const created = res?.data ?? payload;
      if (created && typeof created === "object" && "id" in created) {
        setDroids((prev) => [created as Droid, ...prev]);
        setTotal((t) => t + 1);
      } else {
        await reload();
      }
      return created;
    },
    [reload]
  );

  const updateDroid = React.useCallback(async (id: number, payload: any) => {
    const res = await api.put<any>(`/api/v1/droids/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    const updated = res?.data ?? { id, ...payload };
    setDroids((prev) =>
      prev.map((d) => (d.id === id ? (updated as Droid) : d))
    );
    return updated;
  }, []);

  const deleteDroid = React.useCallback(
    async (droidOrId: number | { id: number }) => {
      const id = typeof droidOrId === "number" ? droidOrId : droidOrId.id;
      await api.delete<void>(`/api/v1/droids/${id}`);
      setDroids((prev) => prev.filter((d) => d.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    },
    []
  );

  // Calcul de la liste filtrée (client-side)
  const filteredDroids = React.useMemo(() => {
    const name = filters.name.trim().toLowerCase();
    const min = filters.priceMin ? Number(filters.priceMin) : null;
    const max = filters.priceMax ? Number(filters.priceMax) : null;

    return droids.filter((d) => {
      if (name && !d.name.toLowerCase().includes(name)) return false;
      if (min !== null && d.price < min) return false;
      if (max !== null && d.price > max) return false;
      if (filters.stock === "IN" && d.stock <= 0) return false;
      if (filters.stock === "OUT" && d.stock > 0) return false;
      return true;
    });
  }, [droids, filters]);

  // Chargement initial
  React.useEffect(() => {
    reload().catch(() => void 0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value: ContextValue = {
    droids,
    filteredDroids,
    total,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    reload,
    createDroid,
    updateDroid,
    deleteDroid,
  };

  return (
    <DroidCatalogContext.Provider value={value}>
      {children}
    </DroidCatalogContext.Provider>
  );
}

export function useDroidCatalog(): ContextValue {
  const ctx = React.useContext(DroidCatalogContext);
  if (!ctx)
    throw new Error(
      "useDroidCatalog must be used within <DroidCatalogProvider>"
    );
  return ctx;
}
