import "@repo/ui/globals.css";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import api from "../lib/api";
import typescriptLogo from "/typescript.svg";
import { Button } from "@repo/ui/components/ui/button";

const App = () => {
  useEffect(() => {
    api
      .get("/")
      .then((res: any) => console.log(res))
      .catch((err: any) => console.error(err));
  }, []);

  return (
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" className="logo" alt="Vite logo" />
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank">
        <img
          src={typescriptLogo}
          className="logo vanilla"
          alt="TypeScript logo"
        />
        <p>ok</p>
      </a>
      <Button>Button</Button>
    </div>
  );
};

createRoot(document.getElementById("app")!).render(<App />);
