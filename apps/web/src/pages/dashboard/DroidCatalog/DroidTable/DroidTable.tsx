import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { Badge } from "@repo/ui";
import { Button } from "@repo/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import type { Droid } from "@repo/types";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function DroidTable({
  rows,
  onEdit,
  onDelete,
  pageSize = 10,
}: {
  rows: Droid[];
  onEdit: (d: Droid) => void;
  onDelete: (d: Droid) => void;
  pageSize?: number;
}) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = useMemo(
    () => rows.slice(page * pageSize, page * pageSize + pageSize),
    [rows, page, pageSize]
  );

  return (
    <div className="grid gap-3">
      <div className="rounded-2xl border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden md:table-cell">Modèle</TableHead>
              <TableHead className="hidden lg:table-cell">Fabricant</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-16 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell className="hidden md:table-cell">{d.type}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {d.maker}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  {d.price}
                  <img
                    src="https://www.clipartmax.com/png/small/362-3628570_making-credits-in-lotj-star-wars-galactic-credit-symbol.png"
                    width="12px"
                  />
                </TableCell>
                <TableCell>
                  {d.stock > 0 ? (
                    <Badge variant="secondary">{d.stock} en stock</Badge>
                  ) : (
                    <Badge variant="destructive">Rupture</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(d)}
                        className="gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(d)}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  Aucun résultat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Page {page + 1} / {pages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(0)}
            disabled={page === 0}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            {"<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(pages - 1, page + 1))}
            disabled={page >= pages - 1}
          >
            {">"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(pages - 1)}
            disabled={page >= pages - 1}
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
}
