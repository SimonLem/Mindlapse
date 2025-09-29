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

## Retour d'expérience

Je me suis lancé avec beaucoup d’enthousiasme car j’adore tester une nouvelle stack.  
Je voulais initialement faire un catalogue de produits liés à la cybersécurité (virus/malwares), avant que ma passion pour Star Wars ne l’emporte et que je choisisse de réaliser un catalogue de droïdes.

Les principales difficultés rencontrées ont été les suivantes :

- **Le set-up du projet** : à chaque fois que je voulais ajouter un élément de la stack attendue (je suis parti d’un turborepo React+Vite avec eslint/prettier), la documentation de la techno poussait à créer un nouveau projet via leur commande tout-en-un (ex : Adonis, Shadcn). Ce n’était pas évident de trouver comment intégrer proprement ces technos dans un monorepo existant.
- **La prise en main de l’architecture monorepo** : la création et le partage des libs globales (types et UI) ont été un peu laborieux. J’ai finalement fait le choix de builder les librairies avant les apps front/back sur Docker afin de les utiliser directement comme packages.
- **La conteneurisation via Docker** : je n’avais pas beaucoup d’expérience avec Docker, surtout dans un contexte monorepo. J’ai donc passé du temps à comprendre comment tout lancer avec un `docker compose up`, et comment gérer les problèmes liés aux packages partagés.

Pour conclure, j’ai beaucoup apprécié de réaliser ce projet qui m’a sorti de ma zone de confort. J’ai consacré environ 10 à 15 heures à ce projet, ce qui représente un investissement conséquent mais très enrichissant. 
J’espère que mon rendu répondra à vos attentes et que nous aurons l’opportunité d’en discuter ensemble prochainement !

---

## Documentation des choix techniques

1. **Base du projet**  
   Je suis parti d’un template Turborepo qui propose une structure monorepo propre, incluant une app React + Vite avec ESLint/Prettier déjà configurés.

2. **Ajout du backend AdonisJS**  
   J’ai ajouté le serveur AdonisJS avec les settings “API Kit”, ce qui installe l’ORM Lucid par défaut.  
   J’ai essayé de remplacer Lucid par Kysely pour être iso avec la stack Mindlapse, mais après environ 30 minutes sans résultats satisfaisants, j’ai préféré avancer avec Lucid et ne pas perdre trop de temps.

3. **Mise en place de Docker**  
   J’ai intégré Docker pour lancer une base PostgreSQL et la connecter au backend.

4. **UI partagée avec ShadCN**  
   J’ai choisi d’utiliser ShadCN et d’en faire un package partagé pour tout le monorepo.  
   C’est la solution la plus cohérente et scalable à long terme, mais j’ai dû investir du temps pour configurer correctement Tailwind/PostCSS/ShadCN entre le global et le front. Le principal problème est venu de la manière de transmettre le package a front : j'envoyais direct le code depuis src/ et celà m'a posé des problèmes jusqu'à ce que je transmettre une version buildée avec dist/.

5. **Types partagés**  
   J’ai ajouté un package partagé contenant les types TypeScript pour être réutilisables entre front et back, en suivant le modèle de ce que j'avais fais pour le package UI ShadCN

6. **Routage et authentification**  
   J’ai mis en place le routage côté frontend avec React Router DOM et réalisé une première page de connexion.  
   Côté auth, AdonisJS (API Kit) fonctionne par sessions : l’utilisateur invité se connecte via la page Login et reçoit un cookie. À chaque appel API, le backend vérifie ce cookie.  
   J’ai également ajouté une route `/me` pour ping le serveur au lancement de l’app React, et restreindre l’accès aux routes protégées côté front.

7. **Modèles, migrations et seed**  
   J’ai ensuite développé les modèles, migrations et seeds pour gérer mes droïdes, ainsi que les routes nécessaire pour le CRUD.

8. **Pages et composants frontend**  
   Côté frontend, j’ai relié mes pages et composants au backend.  
   J’ai choisi d’utiliser un context React pour stocker la liste des droïdes, la logique associée (CRUD) et la pagination.

9. **Détails et finitions**  
   Enfin, j’ai ajouté un context global pour le frontend afin de gérer le mode sombre ( car le diable est dans les détails).
