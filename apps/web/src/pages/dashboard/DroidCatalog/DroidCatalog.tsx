import { useState } from "react";

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

import { toast } from "sonner";

export default function DroidCatalog() {
  // ⬇️ plus de filteredDroids (pagination côté serveur)
  const { createDroid, updateDroid, deleteDroid } =
    useDroidCatalog();

  const [editing, setEditing] = useState<Droid | null>(null);
  const [creatingOpen, setCreatingOpen] = useState<boolean>(false);
  const [pendingDelete, setPendingDelete] = useState<Droid | null>(null);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-end">
        {/* Create */}
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

            <DroidForm
              onSubmit={async (payload) => {
                try {
                  await createDroid(payload);
                  setCreatingOpen(false);
                  toast.success("Droïde créé ✅");
                } catch (e: any) {
                  toast.error(
                    e?.response?.data?.message ||
                      e?.message ||
                      "Création échouée"
                  );
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <FilterBar />

      <DroidTable
        onEdit={(d) => setEditing(d)}
        onDelete={(d) => setPendingDelete(d)}
      />

      {/* Edit */}
      <Dialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier « {editing?.name} »</DialogTitle>
          </DialogHeader>

          {editing ? (
            <DroidForm
              initial={editing}
              onSubmit={async (payload) => {
                try {
                  await updateDroid(editing.id, payload);
                  setEditing(null);
                  toast.success("Modifications enregistrées ✅");
                } catch (e: any) {
                  toast.error(
                    e?.response?.data?.message ||
                      e?.message ||
                      "Mise à jour échouée"
                  );
                }
              }}
            />
          ) : null}
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
              onClick={async () => {
                if (!pendingDelete) return;
                try {
                  await deleteDroid(pendingDelete);
                  toast.success("Droïde supprimé ✅");
                } catch (e: any) {
                  toast.error(
                    e?.response?.data?.message ||
                      e?.message ||
                      "Suppression échouée"
                  );
                } finally {
                  setPendingDelete(null);
                }
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
