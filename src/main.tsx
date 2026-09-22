import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PwaProvider } from "@/context/pwa-context";
import { captureInstallPrompt } from "@/lib/pwa";
import { listenForAppUpdates } from "@/lib/pwa-update";
import "./index.css";

captureInstallPrompt();
listenForAppUpdates();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PwaProvider>
      <App />
    </PwaProvider>
  </StrictMode>,
);
