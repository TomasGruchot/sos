import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { usePwa } from "@/context/pwa-context";

export function InstallGate() {
  const { install, continueToApp, installing } = usePwa();

  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-[max(24px,env(safe-area-inset-top))]">
      <div className="relative mb-10 grid place-items-center">
        <span
          className="absolute h-52 w-52 rounded-full blur-3xl"
          style={{
            background: "oklch(0.62 0.1 230 / 0.28)",
            animation: "breathe 6s ease-in-out infinite",
          }}
        />
        <div
          className="relative grid h-28 w-28 place-items-center rounded-[2rem] border border-white/10"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, oklch(1 0 0 / 0.28), transparent 42%), linear-gradient(180deg, oklch(1 0 0 / 0.08), oklch(1 0 0 / 0.02))",
            boxShadow:
              "inset 0 1px 0 oklch(1 0 0 / 0.2), 0 20px 50px oklch(0 0 0 / 0.35)",
          }}
        >
          <p className="font-display text-[28px] italic tracking-[0.32em] text-shine">
            SOS
          </p>
        </div>
      </div>

      <p className="text-center font-geo text-[13px] font-semibold uppercase tracking-[0.32em] text-white/40">
        Na plochu
      </p>
      <h1 className="mt-3 max-w-[280px] text-center font-geo text-[34px] font-semibold leading-[1.05] tracking-tight">
        Stáhni si SOS jako aplikaci
      </h1>
      <p className="mt-3 max-w-[300px] text-center text-[14px] leading-relaxed text-white/45">
        Jedním gestem na plochu. Pak už bez prohlížeče, jako každá jiná appka.
      </p>

      <div className="mt-10 grid w-full max-w-[360px] gap-3">
        <motion.button
          type="button"
          onClick={() => void install()}
          disabled={installing}
          whileTap={{ scale: 0.985 }}
          className="flex h-14 items-center justify-center gap-2.5 rounded-full bg-white text-[15px] font-semibold text-ink shadow-[0_10px_40px_oklch(1_0_0_/_0.16)] disabled:opacity-60"
        >
          <Download className="h-4 w-4" strokeWidth={2.2} />
          {installing ? "Přidávám na plochu…" : "Stáhnout"}
        </motion.button>
        <button
          type="button"
          onClick={continueToApp}
          className="h-12 text-[14px] text-white/45 transition-colors hover:text-white/80"
        >
          Přejít do aplikace
        </button>
      </div>
    </section>
  );
}
