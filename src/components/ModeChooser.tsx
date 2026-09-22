import { motion } from "framer-motion";
import { Moon, SunMedium } from "lucide-react";
import type { Mode } from "@/data/content";

type Props = {
  onChoose: (mode: Mode) => void;
};

const options: {
  mode: Mode;
  title: string;
  icon: typeof Moon;
}[] = [
  {
    mode: "calm",
    title: "Uklidnit se",
    icon: Moon,
  },
  {
    mode: "energize",
    title: "Nabudit se",
    icon: SunMedium,
  },
];

export function ModeChooser({ onChoose }: Props) {
  return (
    <motion.div
      className="mt-2 grid w-full gap-3"
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
      }}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const calm = opt.mode === "calm";
        return (
          <motion.button
            key={opt.mode}
            type="button"
            onClick={() => onChoose(opt.mode)}
            variants={{
              hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
              show: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            whileTap={{ scale: 0.985 }}
            className="glass group relative overflow-hidden rounded-3xl px-5 py-5 text-left transition-colors"
          >
            <span
              className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              style={{
                opacity: 0.55,
                background: calm
                  ? "oklch(0.6 0.12 240 / 0.35)"
                  : "oklch(0.75 0.14 70 / 0.32)",
              }}
            />
            <span className="relative flex items-center gap-4">
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10"
                style={{
                  background: calm
                    ? "linear-gradient(180deg, oklch(0.55 0.08 240 / 0.35), oklch(0.3 0.05 250 / 0.2))"
                    : "linear-gradient(180deg, oklch(0.75 0.12 80 / 0.35), oklch(0.4 0.08 50 / 0.2))",
                }}
              >
                <Icon className="h-5 w-5 text-white/90" strokeWidth={1.5} />
              </span>
              <span className="flex-1">
                <span className="block font-geo text-[17px] font-semibold tracking-tight">
                  {opt.title}
                </span>
              </span>
              <span className="text-white/25 transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
