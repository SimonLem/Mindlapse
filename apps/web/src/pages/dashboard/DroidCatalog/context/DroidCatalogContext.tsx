import React from "react";
import api from "@/lib/api";
import type { Droid } from "@/lib/droids/types";

type ContextValue = {
  items: Droid[];
  total: number;
  loading: boolean;
  error: string | null;
  reload: (params?: Record<string, any>) => Promise<void>;
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
  const [items, setItems] = React.useState<Droid[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // On mémorise les derniers paramètres envoyés, de manière large
  const [lastQuery, setLastQuery] = React.useState<Record<string, any>>({
    page: 1,
    pageSize: 10,
    inStock: true,
  });

  const reload = React.useCallback(
    async (params?: Record<string, any>) => {
      setLoading(true);

      return;
      try {
        const query = { ...lastQuery, ...(params || {}) };
        const res = await api.get<any>("/api/v1/droids", { params: query });

        // On tolère plusieurs formats de réponse pour éviter de “casser”
        // - format attendu: { items, total, page, pageSize }
        // - fallback si jamais l'API renvoie directement un tableau
        const data = res?.data;
        if (Array.isArray(data)) {
          setItems(data as Droid[]);
          setTotal(data.length);
        } else {
          setItems((data?.items ?? []) as Droid[]);
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
      // On essaie d’insérer en tête si on a un id, sinon on reload
      if (created && typeof created === "object" && "id" in created) {
        setItems((prev) => [created as Droid, ...prev]);
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
    setItems((prev) => prev.map((d) => (d.id === id ? (updated as Droid) : d)));
    return updated;
  }, []);

  const deleteDroid = React.useCallback(
    async (droidOrId: number | { id: number }) => {
      const id = typeof droidOrId === "number" ? droidOrId : droidOrId.id;
      await api.delete<void>(`/api/v1/droids/${id}`);
      setItems((prev) => prev.filter((d) => d.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    },
    []
  );

  // Chargement initial
  React.useEffect(() => {
    reload().catch(() => void 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: ContextValue = {
    items,
    total,
    loading,
    error,
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
