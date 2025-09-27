import "@repo/ui/globals.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/dashboard/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-3xl">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

createRoot(document.getElementById("app")!).render(<App />);
