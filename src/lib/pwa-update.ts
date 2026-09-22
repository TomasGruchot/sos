import { registerSW } from "virtual:pwa-register";

/** Při otevření appky stáhne nový service worker a stránku jednou obnoví. */
export function listenForAppUpdates() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  let reloading = false;
  const reload = () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  };

  let hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) {
      hadController = true;
      return;
    }
    reload();
  });

  registerSW({
    immediate: true,
    onNeedReload: reload,
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;

      const check = async () => {
        if (!navigator.onLine || registration.installing) return;
        try {
          await fetch(swUrl, {
            cache: "no-store",
            headers: { "cache-control": "no-cache" },
          });
          await registration.update();
        } catch {
          /* offline */
        }
      };

      void check();
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") void check();
      });
      window.addEventListener("focus", () => {
        void check();
      });
    },
  });
}
