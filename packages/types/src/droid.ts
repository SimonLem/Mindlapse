export const DROID_TYPES = [
  "PROTOCOL",
  "COMBAT",
  "PILOT",
  "ASTROMECH",
  "MEDICAL",
  "REPAIR",
] as const;

export type DroidType = (typeof DROID_TYPES)[number];

export const DROID_MAKERS = [
  "INDUSTRIAL_AUTOMATON",
  "CYBOT_GALACTIC",
  "KUAT_SYSTEMS_ENGINEERING",
  "HOLOWAN_ARMAMENT",
] as const;

export type DroidMaker = (typeof DROID_MAKERS)[number];

export interface Droid {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: DroidType;
  maker: DroidMaker;
  price: number; // number in API; DB keeps decimal
  stock: number;
  imageUrl: string | null;
  createdAt: string; // ISO strings on the wire
  updatedAt: string;
}

export interface DroidQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  type?: DroidType;
  inStock?: boolean;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
