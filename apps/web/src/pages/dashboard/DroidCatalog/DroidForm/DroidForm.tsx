import React, { useState } from "react";
import { Label } from "@repo/ui";
import { Input } from "@repo/ui";
import { Button } from "@repo/ui";
import type { Droid } from "@repo/types";

export default function DroidForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<Droid>;
  onSubmit: (d: Omit<Droid, "id">) => void;
}) {
  const [form, setForm] = useState<Partial<Droid>>({
    name: initial?.name ?? "",
    type: initial?.type ?? "PROTOCOL",
    maker: initial?.maker ?? "INDUSTRIAL_AUTOMATON",
    price: initial?.price ?? 0,
    stock: initial?.stock ?? 0,
  });
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={form.name!}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ex: R2-D2"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="model">Modèle</Label>
        <Input
          id="model"
          value={form.model!}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          placeholder="Ex: Astromech"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="manufacturer">Fabricant</Label>
        <Input
          id="manufacturer"
          value={form.manufacturer!}
          onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
          placeholder="Ex: Industrial Automaton"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Prix (crédits)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            value={form.price!}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min={0}
            value={form.stock!}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <Button
        onClick={() =>
          onSubmit({
            name: form.name?.trim() || "Sans nom",
            model: form.model?.trim() || "—",
            manufacturer: form.manufacturer?.trim() || "—",
            price: Math.max(0, Number(form.price) || 0),
            stock: Math.max(0, Number(form.stock) || 0),
          })
        }
      >
        Enregistrer
      </Button>
    </div>
  );
}
