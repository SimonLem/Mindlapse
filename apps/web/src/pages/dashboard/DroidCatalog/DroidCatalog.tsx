import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui";

// import { Plus } from "lucide-react";

// import FilterBar from "@/components/droids/FilterBar";
// import DroidTable from "@/components/droids/DroidTable";
// import DroidForm from "@/components/droids/DroidForm";

import type { Droid } from "@repo/types";
// import { toast } from "sonner";

import api from "@/lib/api";

import { useDroidCatalog } from "./context/DroidCatalogContext";

export default function DroidCatalog() {
  const navigate = useNavigate();
  const [data, setData] = useState<{ items: any[]; total: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { items, createDroid, updateDroid, deleteDroid } = useDroidCatalog();

  useEffect(() => {
    api
      .get("/api/v1/droids", {
        params: { page: 1, pageSize: 10, inStock: true },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err?.response?.status === 401)
          navigate("/login", { replace: true });
        else setError(err?.message ?? "Failed to load droids");
      });
  }, [navigate]);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!data) return <div className="p-4">Loading…</div>;

  // Filtres
  const [name, setName] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [stockFilter, setStockFilter] = useState<"ALL" | "IN" | "OUT">("ALL");

  const filtered = useMemo(() => {
    return items.filter((d) => {
      if (name && !d.name.toLowerCase().includes(name.toLowerCase()))
        return false;
      if (priceMin && d.price < Number(priceMin)) return false;
      if (priceMax && d.price > Number(priceMax)) return false;
      if (stockFilter === "IN" && d.stock <= 0) return false;
      if (stockFilter === "OUT" && d.stock > 0) return false;
      return true;
    });
  }, [items, name, priceMin, priceMax, stockFilter]);

  // CRUD (modals)
  const [editing, setEditing] = useState<Droid | null>(null);
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Droid | null>(null);

  return (
    <Tabs defaultValue="products" className="grid gap-6">
      <TabsList>
        <TabsTrigger value="products">Produits</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Paramètres
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            {filtered.length} résultat(s)
          </div>
          <Dialog open={creatingOpen} onOpenChange={setCreatingOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                {/* <Plus className="w-4 h-4" /> */}
                Ajouter un droïde
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau droïde</DialogTitle>
                <DialogDescription>Créer un nouveau produit.</DialogDescription>
              </DialogHeader>
              {/* <DroidForm
                onSubmit={(payload) => {
                  createDroid(payload);
                  toast.success("Droïde créé");
                  setCreatingOpen(false);
                }}
              /> */}
            </DialogContent>
          </Dialog>
        </div>

        {/* <FilterBar
          name={name}
          setName={setName}
          priceMin={priceMin}
          setPriceMin={setPriceMin}
          priceMax={priceMax}
          setPriceMax={setPriceMax}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
        />

        <DroidTable
          rows={filtered}
          onEdit={(d) => setEditing(d)}
          onDelete={(d) => setPendingDelete(d)}
        /> */}
      </TabsContent>

      {/* Edit */}
      <Dialog
        open={!!editing}
        onOpenChange={(open: any) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier « {editing?.name} »</DialogTitle>
          </DialogHeader>
          {/* {editing ? (
            <DroidForm
              initial={editing}
              onSubmit={(payload) => {
                updateDroid(editing.id, payload);
                toast.success("Modifications enregistrées");
                setEditing(null);
              }}
            />
          ) : null} */}
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Supprimer « {pendingDelete?.name} » ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) {
                  deleteDroid(pendingDelete);
                  toast("Supprimé");
                }
                setPendingDelete(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  );
}
