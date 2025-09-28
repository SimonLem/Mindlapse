import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api";

export type User = {
  id: number;
  email: string;
  name?: string;
  roles?: string[];
} | null;

type AuthContextValue = {
  user: User;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE = "http://localhost:3333";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api(`/v1/auth/me`);
      if (res.status !== 200) {
        setUser(null);
      } else {
        const data = res.data as NonNullable<User>;
        setUser(data);
      }
    } catch (e: any) {
      setError(e?.message ?? "Auth check failed");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    // TO DO
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, refresh, signOut }),
    [user, loading, error, refresh, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
