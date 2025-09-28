import "@repo/ui/globals.css";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";

import { ThemeProvider } from "@/theme/ThemeProvider";

import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/dashboard/Dashboard";

type User = { id: number; email: string; fullName: string | null };

const API_BASE = "http://localhost:3333";

async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}

async function requireAuth() {
  const me = await fetchMe();
  if (!me) throw redirect("/login");
  return me;
}

async function guestOnly() {
  const me = await fetchMe();
  if (me) throw redirect("/dashboard");
  return null;
}

const router = createBrowserRouter([
  { id: "root", path: "/", loader: () => redirect("/login") },
  { path: "/login", loader: guestOnly, element: <Login /> },
  { path: "/dashboard", loader: requireAuth, element: <Dashboard /> },
  { path: "*", loader: () => redirect("/login") },
]);

createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
