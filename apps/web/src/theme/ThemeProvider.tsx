// src/theme/ThemeProvider.tsx
import * as React from "react";
import { Button } from "@repo/ui";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<Ctx | null>(null);
const STORAGE_KEY = "theme";

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light");

  // init: localStorage > system preference
  React.useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? null;
    const preferred: Theme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initial = saved ?? preferred;
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  // persist + appliquer la classe .dark
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }, [theme]);

  const setTheme = React.useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = React.useCallback(
    () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  const value = React.useMemo<Ctx>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Ctx {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      className={className ?? "gap-2"}
      onClick={toggleTheme}
      aria-label="Basculer le thème"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="text-sm">{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}
