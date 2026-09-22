import { AnimatePresence, motion } from "framer-motion";
import { Download, Plus, Share } from "lucide-react";
import { usePwa } from "@/context/pwa-context";
import { isIosSafari } from "@/lib/pwa";

export function InstallHint() {
  const { iosHint, manualHint, closeHint, continueToApp, showGate } = usePwa();
  const open = iosHint || manualHint;
  const safari = isIosSafari();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center px-5 pb-[max(22px,env(safe-area-inset-bottom))] pt-10 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Zavřít"
            className="absolute inset-0 bg-black/45"
            onClick={closeHint}
          />
          <motion.div
            className="glass relative w-full max-w-[380px] rounded-[28px] px-5 py-5"
            initial={{ y: 24, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {iosHint ? (
              <IosSteps safari={safari} />
            ) : (
              <ManualSteps />
            )}
            <button
              type="button"
              onClick={closeHint}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-full border border-white/10 text-[14px] text-white/80"
            >
              Zpět
            </button>
            {showGate && (
              <button
                type="button"
                onClick={continueToApp}
                className="mt-2 h-10 w-full text-[13px] text-white/40 hover:text-white/70"
              >
                Přejít do aplikace
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IosSteps({ safari }: { safari: boolean }) {
  const steps = safari
    ? [
        { icon: Share, text: "Dole klepni na Sdílet" },
        { icon: Plus, text: "Zvol Přidat na plochu" },
        { icon: Download, text: "Potvrď Přidat" },
      ]
    : [
        { icon: Share, text: "Otevři tuhle stránku v Safari" },
        { icon: Plus, text: "Sdílet → Přidat na plochu" },
      ];

  return (
    <div>
      <p className="font-geo text-[17px] font-semibold tracking-tight">
        {safari ? "Přidat na plochu" : "Otevři to v Safari"}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-white/45">
        {safari
          ? "iOS to potvrdí jednou. Pak je SOS mezi aplikacemi."
          : "Na iPhonu umí přidat na plochu jen Safari."}
      </p>
      <ol className="mt-4 space-y-3">
        {steps.map((step) => (
          <li
            key={step.text}
            className="flex items-center gap-3 text-[14px] text-white/80"
          >
            <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <step.icon className="h-4 w-4 text-white/80" strokeWidth={1.7} />
            </span>
            {step.text}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ManualSteps() {
  return (
    <div>
      <p className="font-geo text-[17px] font-semibold tracking-tight">
        Nainstalovat z prohlížeče
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-white/45">
        Chrome a Edge přidají SOS na plochu i mezi aplikace.
      </p>
      <ol className="mt-4 space-y-2 text-[14px] leading-relaxed text-white/80">
        <li>1. Otevři menu prohlížeče (⋮)</li>
        <li>2. Zvol Nainstalovat SOS</li>
        <li>3. Potvrď — ikona se objeví na ploše</li>
      </ol>
    </div>
  );
}
