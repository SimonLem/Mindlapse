import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@repo/ui";
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

import { Plus } from "lucide-react";

import FilterBar from "./FilterBar/FilterBar";
import DroidTable from "./DroidTable/DroidTable";
import DroidForm from "./DroidForm/DroidForm";

import type { Droid } from "@repo/types";

import { useDroidCatalog } from "./context/DroidCatalogContext";

export default function DroidCatalog() {
  const navigate = useNavigate();
  const {
    filteredDroids,
    createDroid,
    updateDroid,
    deleteDroid,
    loading,
    error,
  } = useDroidCatalog();

  // CRUD (modals)
  const [editing, setEditing] = useState<Droid | null>(null);
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Droid | null>(null);

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (loading) return <div className="p-4">Loading…</div>;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredDroids.length} résultat(s)
        </div>
        <Dialog open={creatingOpen} onOpenChange={setCreatingOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un droïde
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau droïde</DialogTitle>
              <DialogDescription>
                Renseigner les informations du nouveau droïde.
              </DialogDescription>
            </DialogHeader>
            <DroidForm />
          </DialogContent>
        </Dialog>
      </div>

      <FilterBar />
      <DroidTable
        rows={filteredDroids}
        onEdit={(d) => setEditing(d)}
        onDelete={(d) => setPendingDelete(d)}
      />

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
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
              onClick={() => {
                if (pendingDelete) {
                  deleteDroid(pendingDelete);
                  // toast("Supprimé");
                }
                setPendingDelete(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
