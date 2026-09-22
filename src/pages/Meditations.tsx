import { motion } from "framer-motion";
import { kindLabel, meditations } from "@/data/content";
import { useApp } from "@/context/app-context";
import { formatTime } from "@/lib/utils";

export function MeditationsPage() {
  const { startMeditation } = useApp();

  return (
    <div className="flex flex-1 flex-col pt-[max(18px,env(safe-area-inset-top))]">
      <p className="font-geo text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
        Ticho
      </p>
      <h1 className="mt-1 font-display text-[34px] italic leading-none">
        Meditace
      </h1>
      <p className="mt-3 max-w-[300px] text-[13px] leading-relaxed text-white/40">
        Krátké rituály. Žádné série, žádné streaky. Jen čas, který si vezmeš.
      </p>

      <div className="mt-6 flex flex-col gap-2.5 pb-6">
        {meditations.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => startMeditation(item)}
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass group relative overflow-hidden rounded-3xl px-4 py-4 text-left"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-white/50 to-transparent opacity-40" />
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="block font-geo text-[16px] font-semibold tracking-tight">
                  {item.title}
                </span>
                <span className="mt-1 block text-[12.5px] leading-relaxed text-white/45">
                  {item.subtitle}
                </span>
              </span>
              <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/45">
                {formatTime(item.durationSec)}
              </span>
            </span>
            <span className="mt-3 inline-flex text-[11px] uppercase tracking-[0.2em] text-white/30">
              {kindLabel[item.kind]}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
