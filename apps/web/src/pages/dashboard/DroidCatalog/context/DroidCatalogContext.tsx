import React from "react";
import api from "@/lib/api";
import type { Droid, DroidMaker, DroidType } from "@repo/types";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

/** Filtres centralisés dans le context */
export type StockFilter = "ALL" | "IN" | "OUT";
export type Filters = {
  name: string;       // texte libre -> q
  priceMin: string;   // string pour l'<Input />
  priceMax: string;   // idem
  stock: StockFilter; // -> inStock
};

const DEFAULT_FILTERS: Filters = {
  name: "",
  priceMin: "",
  priceMax: "",
  stock: "ALL",
};

const FILTERS_STORAGE_KEY = "droid_filters_v1";

type Query = {
  page?: number;
  pageSize?: number;
  q?: string;
  inStock?: boolean;
  priceMin?: number;
  priceMax?: number;
  type?: DroidType;
  maker?: DroidMaker;
};

type ContextValue = {
  droids: Droid[];     // items de la page courante
  total: number;       // total côté serveur
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  setPageSize: (n: number) => void;
  goToPage: (p: number) => Promise<void>;

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

export function DroidCatalogProvider({ children }: { children: React.ReactNode }) {
  const [droids, setDroids] = React.useState<Droid[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSizeState] = React.useState(10);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filtres centralisés + persistance localStorage
  const [filters, setFilters] = useLocalStorage<Filters>(FILTERS_STORAGE_KEY, DEFAULT_FILTERS);

  const resetFilters = React.useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, [setFilters]);

  const buildParamsFromState = React.useCallback((): Query => {
    const q = filters.name.trim() || undefined;
    const priceMin = filters.priceMin ? Number(filters.priceMin) : undefined;
    const priceMax = filters.priceMax ? Number(filters.priceMax) : undefined;
    const inStock =
      filters.stock === "IN" ? true : filters.stock === "OUT" ? false : undefined;

    return {
      page,
      pageSize,
      q,
      inStock,
      priceMin,
      priceMax,
    };
  }, [filters, page, pageSize]);

  const reload = React.useCallback(
    async (params?: Query) => {
      setLoading(true);
      try {
        // merge params explicites avec l’état courant
        const merged: Query = { ...buildParamsFromState(), ...(params || {}) };

        // si on change de page/pageSize via params, mets à jour l’état local avant call
        if (typeof merged.page === "number" && merged.page !== page) setPage(merged.page);
        if (typeof merged.pageSize === "number" && merged.pageSize !== pageSize)
          setPageSizeState(merged.pageSize);

        const res = await api.get<any>("/api/v1/droids", { params: merged });

        const data = res?.data;
        // format attendu: { items, total, page, pageSize }
        const items: Droid[] = Array.isArray(data) ? (data as Droid[]) : (data?.items ?? []);
        const totalCount: number = Array.isArray(data) ? items.length : Number(data?.total ?? 0);
        const currentPage: number = Number(data?.page ?? merged.page ?? 1);
        const currentPageSize: number = Number(data?.pageSize ?? merged.pageSize ?? 10);

        setDroids(items);
        setTotal(totalCount);
        setPage(currentPage);
        setPageSizeState(currentPageSize);
        setError(null);
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Failed to load droids");
      } finally {
        setLoading(false);
      }
    },
    [buildParamsFromState, page, pageSize]
  );

  const goToPage = React.useCallback(
    async (p: number) => {
      // clamp
      const pages = Math.max(1, Math.ceil(total / pageSize));
      const next = Math.min(Math.max(1, p), pages);
      await reload({ page: next });
    },
    [reload, total, pageSize]
  );

  const setPageSize = React.useCallback(
    (n: number) => {
      // reset à page 1 quand on change le pageSize
      void reload({ page: 1, pageSize: n });
    },
    [reload]
  );

  const createDroid = React.useCallback(
    async (payload: any) => {
      await api.post<any>("/api/v1/droids", payload, {
        headers: { "Content-Type": "application/json" },
      });
      // recharge la page courante (conserve pagination)
      await reload();
    },
    [reload]
  );

  const updateDroid = React.useCallback(
    async (id: number, payload: any) => {
      await api.put<any>(`/api/v1/droids/${id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      await reload();
    },
    [reload]
  );

  const deleteDroid = React.useCallback(
    async (droidOrId: number | { id: number }) => {
      const id = typeof droidOrId === "number" ? droidOrId : droidOrId.id;
      await api.delete<void>(`/api/v1/droids/${id}`);
      // si on supprime le dernier item de la dernière page, recule d’une page
      const remaining = total - 1;
      const pagesAfter = Math.max(1, Math.ceil(remaining / pageSize));
      const targetPage = Math.min(page, pagesAfter);
      await reload({ page: targetPage });
    },
    [page, pageSize, reload, total]
  );

  // Recalculs UI
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  // (re)chargement initial ou à chaque changement de filtres : reset à page 1
  React.useEffect(() => {
    void reload({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.name, filters.priceMin, filters.priceMax, filters.stock]);

  const value: ContextValue = {
    droids,
    total,
    page,
    pageSize,
    totalPages,
    hasPrev,
    hasNext,
    setPageSize,
    goToPage,

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

  return <DroidCatalogContext.Provider value={value}>{children}</DroidCatalogContext.Provider>;
}

export function useDroidCatalog(): ContextValue {
  const ctx = React.useContext(DroidCatalogContext);
  if (!ctx) throw new Error("useDroidCatalog must be used within <DroidCatalogProvider>");
  return ctx;
}
