import React from "react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@repo/ui";
import { Boxes, DollarSign, Filter as FilterIcon } from "lucide-react";
import { useDroidCatalog } from "../context/DroidCatalogContext";

export default function FilterBar() {
  const { filters, setFilters, resetFilters, total, reload, loading } = useDroidCatalog();

  const activeCount =
    (filters.name ? 1 : 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    (filters.stock !== "ALL" ? 1 : 0);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="filters" className="rounded-md border">
        <AccordionTrigger className="px-4 py-2 text-base">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            Filtres
            {activeCount > 0 && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                {activeCount}
              </span>
            )}
          </div>
        </AccordionTrigger>

        <AccordionContent>
          <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-2">
              <Label>Nom</Label>
              <Input
                placeholder="Rechercher un droïde…"
                value={filters.name}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Prix min
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, priceMin: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Prix max
              </Label>
              <Input
                type="number"
                min={0}
                placeholder="15000"
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, priceMax: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Boxes className="w-4 h-4" />
                Stock
              </Label>
              <Select
                value={filters.stock}
                onValueChange={(v) =>
                  setFilters((f) => ({ ...f, stock: v as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous</SelectItem>
                  <SelectItem value="IN">En stock</SelectItem>
                  <SelectItem value="OUT">Rupture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-full flex items-center justify-between gap-2 pt-2">
              <div className="text-sm text-muted-foreground">
                {loading ? "Chargement…" : `${total} résultat(s)`}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetFilters}
                >
                  Réinitialiser
                </Button>
                <Button
                  type="button"
                  onClick={() => reload({ page: 1 })}
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
