import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./index.scss";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";

if (import.meta.env.DEV) {
  import('./mocks/browser').then(({ worker }) => { worker.start() })
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="app-container">
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter>
    </div>
  </StrictMode>,
);
