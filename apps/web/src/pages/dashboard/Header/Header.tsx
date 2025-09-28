// src/components/Header.tsx
import { Button } from "@repo/ui";
import { ThemeToggle } from "@/theme/ThemeProvider";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import * as React from "react";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header(props: HeaderProps) {
  const { title, subtitle } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await api.delete("/api/v1/auth/logout");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/75/Emblem_of_the_First_Galactic_Empire.svg"
          width="80"
          alt="Empire Emblem"
          className="dark:invert"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "Déconnexion…" : "Déconnexion"}
        </Button>
      </div>
    </div>
  );
}
