import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  GATE_DISMISS_KEY,
  PWA_INSTALLED_KEY,
  type BeforeInstallPromptEvent,
  captureInstallPrompt,
  isIosDevice,
  isStandalone,
  readFlag,
  writeFlag,
} from "@/lib/pwa";

type PwaState = {
  standalone: boolean;
  installed: boolean;
  dismissed: boolean;
  showGate: boolean;
  showInstallButton: boolean;
  installing: boolean;
  iosHint: boolean;
  manualHint: boolean;
  install: () => Promise<void>;
  continueToApp: () => void;
  closeHint: () => void;
};

const PwaContext = createContext<PwaState | null>(null);

export function PwaProvider({ children }: { children: ReactNode }) {
  const [standalone] = useState(() => isStandalone());
  const [installed, setInstalled] = useState(
    () => standalone || readFlag(PWA_INSTALLED_KEY),
  );
  const [dismissed, setDismissed] = useState(() => readFlag(GATE_DISMISS_KEY));
  const [installing, setInstalling] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [manualHint, setManualHint] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(
    () => Boolean(window.__soosDeferredPrompt),
  );
  const waiters = useRef<Array<(event: BeforeInstallPromptEvent | null) => void>>(
    [],
  );

  useEffect(() => {
    captureInstallPrompt();
    if (window.__soosDeferredPrompt) setHasPrompt(true);

    const onReady = () => setHasPrompt(true);
    const onInstalled = () => {
      setInstalled(true);
      setIosHint(false);
      setManualHint(false);
    };
    window.addEventListener("soos-install-ready", onReady);
    window.addEventListener("soos-installed", onInstalled);
    return () => {
      window.removeEventListener("soos-install-ready", onReady);
      window.removeEventListener("soos-installed", onInstalled);
    };
  }, []);

  const waitForPrompt = useCallback((ms: number) => {
    const existing = window.__soosDeferredPrompt;
    if (existing) return Promise.resolve(existing);
    return new Promise<BeforeInstallPromptEvent | null>((resolve) => {
      const timer = window.setTimeout(() => {
        waiters.current = waiters.current.filter((fn) => fn !== settle);
        resolve(null);
      }, ms);
      const settle = (event: BeforeInstallPromptEvent | null) => {
        window.clearTimeout(timer);
        resolve(event);
      };
      waiters.current.push(settle);
    });
  }, []);

  useEffect(() => {
    if (!hasPrompt || !window.__soosDeferredPrompt) return;
    const event = window.__soosDeferredPrompt;
    const pending = waiters.current.splice(0);
    pending.forEach((fn) => fn(event));
  }, [hasPrompt]);

  const continueToApp = useCallback(() => {
    writeFlag(GATE_DISMISS_KEY);
    setDismissed(true);
    setIosHint(false);
    setManualHint(false);
  }, []);

  const closeHint = useCallback(() => {
    setIosHint(false);
    setManualHint(false);
  }, []);

  const install = useCallback(async () => {
    if (installing) return;
    setManualHint(false);

    if (isIosDevice()) {
      setIosHint(true);
      return;
    }

    setInstalling(true);
    try {
      const event = await waitForPrompt(hasPrompt ? 0 : 8000);
      if (!event) {
        setManualHint(true);
        return;
      }
      await event.prompt();
      const { outcome } = await event.userChoice;
      window.__soosDeferredPrompt = undefined;
      setHasPrompt(false);
      if (outcome === "accepted") {
        writeFlag(PWA_INSTALLED_KEY);
        writeFlag(GATE_DISMISS_KEY);
        setInstalled(true);
        setDismissed(true);
      }
    } catch {
      setManualHint(true);
    } finally {
      setInstalling(false);
    }
  }, [hasPrompt, installing, waitForPrompt]);

  const value = useMemo<PwaState>(
    () => ({
      standalone,
      installed,
      dismissed,
      showGate: !standalone && !installed && !dismissed,
      showInstallButton: !standalone && !installed && dismissed,
      installing,
      iosHint,
      manualHint,
      install,
      continueToApp,
      closeHint,
    }),
    [
      standalone,
      installed,
      dismissed,
      installing,
      iosHint,
      manualHint,
      install,
      continueToApp,
      closeHint,
    ],
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}

export function usePwa() {
  const ctx = useContext(PwaContext);
  if (!ctx) throw new Error("usePwa must be used inside PwaProvider");
  return ctx;
}
