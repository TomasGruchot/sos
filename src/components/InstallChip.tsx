import { Download } from "lucide-react";
import { usePwa } from "@/context/pwa-context";

export function InstallChip() {
  const { showInstallButton, install, installing } = usePwa();
  if (!showInstallButton) return null;

  return (
    <button
      type="button"
      onClick={() => void install()}
      disabled={installing}
      className="glass inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white disabled:opacity-50"
      aria-label="Stáhnout aplikaci na plochu"
    >
      <Download className="h-3.5 w-3.5" strokeWidth={2} />
      Stáhnout
    </button>
  );
}
