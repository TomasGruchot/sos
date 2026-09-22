export const GATE_DISMISS_KEY = "soos.install-gate.dismissed";
export const PWA_INSTALLED_KEY = "soos.pwa.installed";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __soosDeferredPrompt?: BeforeInstallPromptEvent;
    __soosPromptBound?: boolean;
  }
}

export function readFlag(key: string) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeFlag(key: string) {
  try {
    localStorage.setItem(key, "1");
  } catch {
    /* private mode */
  }
}

export function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: window-controls-overlay)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function isIosDevice() {
  const ua = navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return iOS;
}

/** Safari na iOS umí Přidat na plochu. Chrome/Firefox na iOS ne. */
export function isIosSafari() {
  if (!isIosDevice()) return false;
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
}

export function captureInstallPrompt() {
  if (typeof window === "undefined" || window.__soosPromptBound) return;
  window.__soosPromptBound = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    window.__soosDeferredPrompt = event as BeforeInstallPromptEvent;
    window.dispatchEvent(new Event("soos-install-ready"));
  });

  window.addEventListener("appinstalled", () => {
    window.__soosDeferredPrompt = undefined;
    writeFlag(PWA_INSTALLED_KEY);
    window.dispatchEvent(new Event("soos-installed"));
  });
}
