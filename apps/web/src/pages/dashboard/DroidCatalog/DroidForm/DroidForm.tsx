import React, { useState } from "react";
import {
  Label,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import type { Droid, DroidType, DroidMaker } from "@repo/types";
import { DROID_TYPES, DROID_MAKERS } from "@repo/types";

const TYPE_LABELS: Record<DroidType, string> = {
  PROTOCOL: "Protocolaire",
  COMBAT: "Combat",
  PILOT: "Pilotage",
  ASTROMECH: "Astromécano",
  MEDICAL: "Médical",
  REPAIR: "Réparation",
};

const MAKER_LABELS: Record<DroidMaker, string> = {
  INDUSTRIAL_AUTOMATON: "Industrial Automaton",
  CYBOT_GALACTIC: "Cybot Galactica",
  KUAT_SYSTEMS_ENGINEERING: "Kuat Systems Engineering",
  HOLOWAN_ARMAMENT: "Holowan Armament",
};

function toSlug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

type Props = {
  initial?: Partial<Droid>;
  onSubmit: (d: Omit<Droid, "id">) => void;
};

export default function DroidForm(props: Props) {
  // destructuring done *inside* the function, not in the signature
  const { initial, onSubmit } = props;

  const [form, setForm] = useState<Partial<Droid>>({
    name: initial?.name ?? "",
    type: (initial?.type as DroidType) ?? "PROTOCOL",
    maker: (initial?.maker as DroidMaker) ?? "INDUSTRIAL_AUTOMATON",
    price: initial?.price ?? 1000,
    stock: initial?.stock ?? 0,
    description: initial?.description ?? "",
  });

  const canSubmit = (form.name ?? "").trim().length > 0;

  return (
    <div className="grid gap-4">
      {/* Nom */}
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={form.name ?? ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Ex: R2-D2"
        />
      </div>

      {/* Type */}
      <div className="grid gap-2">
        <Label>Type</Label>
        <Select
          value={(form.type as DroidType) ?? "PROTOCOL"}
          onValueChange={(v) => setForm({ ...form, type: v as DroidType })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir un type" />
          </SelectTrigger>
          <SelectContent>
            {DROID_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fabricant */}
      <div className="grid gap-2">
        <Label>Fabricant</Label>
        <Select
          value={(form.maker as DroidMaker) ?? "INDUSTRIAL_AUTOMATON"}
          onValueChange={(v) => setForm({ ...form, maker: v as DroidMaker })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir un fabricant" />
          </SelectTrigger>
          <SelectContent>
            {DROID_MAKERS.map((m) => (
              <SelectItem key={m} value={m}>
                {MAKER_LABELS[m]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prix / Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Prix (crédits)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            value={form.price ?? 0}
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
            value={form.stock ?? 0}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Description (optionnel) */}
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          className="min-h-[90px] rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={(form.description as string) ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Ex: Droïde astromech polyvalent..."
        />
      </div>

      <Button
        disabled={!canSubmit}
        onClick={() => {
          const name = (form.name ?? "").trim() || "Sans nom";
          const payload: Omit<Droid, "id"> = {
            name,
            slug: toSlug(name),
            description: (form.description as string) || null,
            type: (form.type as DroidType) ?? "PROTOCOL",
            maker: (form.maker as DroidMaker) ?? "INDUSTRIAL_AUTOMATON",
            price: Math.max(0, Number(form.price) || 0),
            stock: Math.max(0, Number(form.stock) || 0),
            imageUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          onSubmit(payload);
        }}
      >
        Enregistrer
      </Button>
    </div>
  );
}
