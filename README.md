# `Intranet impérial` — Mindlapse

Réalisé pour le **test technique Mindlapse**. Monorepo Turborepo (React/Vite + AdonisJS).

---

## Prérequis

- **Docker** 

## Comment lancer le projet

1) Récuperer et placer les fichiers .env au bon endroit

2) Démarrage complet via Docker (API + Front + DB) :

```bash
docker compose -f infra/docker/compose.full.yaml up --build
```

Services exposés :
- Front (Vite) : http://localhost:5173  
- API (AdonisJS) : http://localhost:3333  
- Postgres : localhost:5432 

> Les migrations + seed sont appliqués au démarrage.

---

## Apps et Packages

- `apps/web` — React + [Vite](https://vitejs.dev) (TypeScript)
- `apps/api` — AdonisJS (Lucid, migrations/seeders)
- `packages/types` — `@repo/types`, lib de types partagée
- `packages/ui` — `@repo/ui`, lib de composants partagée
- `packages/eslint-config` — `@repo/eslint-config`, config ESLint partagée
- `packages/typescript-config` — `@repo/typescript-config`, `tsconfig.json` partagés

---

## Utilitaires

- [TypeScript](https://www.typescriptlang.org/) pour le typage
- [ESLint](https://eslint.org/) pour le lint
- [Prettier](https://prettier.io) pour le formatage

---

## UI / Styling

- **Tailwind CSS** (utility-first)
- **shadcn/ui** (composants React basés sur Radix UI)
- **lucide-react** (icônes)
- **tailwindcss-animate** (animations)

---

## API

- `GET /api/v1/droids` — liste paginée  
  Params : `page`, `pageSize (<=100)`, `q`, `type`, `inStock`, `priceMin`, `priceMax`
- `POST /api/v1/droids` — création
- `PUT /api/v1/droids/:id` — mise à jour
- `DELETE /api/v1/droids/:id` — suppression

---