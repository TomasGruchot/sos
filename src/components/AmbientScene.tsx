import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Mode } from "@/data/content";

type Props = {
  mode: Mode | null;
  intense?: boolean;
};

export function AmbientScene({ mode, intense = false }: Props) {
  const palette = useMemo(() => {
    if (mode === "energize") {
      return {
        a: "oklch(0.42 0.12 55 / 0.55)",
        b: "oklch(0.32 0.1 40 / 0.4)",
        c: "oklch(0.28 0.06 80 / 0.35)",
        veil: "oklch(0.1 0.03 50 / 0.55)",
      };
    }
    if (mode === "calm") {
      return {
        a: "oklch(0.38 0.1 250 / 0.5)",
        b: "oklch(0.3 0.08 280 / 0.42)",
        c: "oklch(0.28 0.05 200 / 0.32)",
        veil: "oklch(0.1 0.03 270 / 0.6)",
      };
    }
    if (mode === "rescue") {
      return {
        a: "oklch(0.4 0.12 18 / 0.5)",
        b: "oklch(0.32 0.1 350 / 0.4)",
        c: "oklch(0.28 0.06 30 / 0.32)",
        veil: "oklch(0.1 0.03 15 / 0.55)",
      };
    }
    return {
      a: "oklch(0.32 0.06 270 / 0.45)",
      b: "oklch(0.28 0.05 230 / 0.32)",
      c: "oklch(0.26 0.05 40 / 0.22)",
      veil: "oklch(0.09 0.02 280 / 0.55)",
    };
  }, [mode]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,oklch(0.22_0.03_280),var(--color-ink-deep)_55%,oklch(0.08_0.02_280))]" />

      <motion.div
        className="aurora"
        animate={{ opacity: intense ? 1 : 0.85 }}
        transition={{ duration: 1.2 }}
        style={{
          background: `
            radial-gradient(ellipse 55% 40% at 50% 8%, ${palette.a}, transparent 70%),
            radial-gradient(ellipse 40% 35% at 12% 78%, ${palette.b}, transparent 70%),
            radial-gradient(ellipse 45% 38% at 88% 72%, ${palette.c}, transparent 70%)
          `,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 42%, transparent 0%, ${palette.veil} 72%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.35) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.35) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 10%, transparent 70%)",
        }}
      />

      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/70"
          style={{
            left: `${8 + ((i * 17) % 84)}%`,
            bottom: `${-5 + (i % 5)}%`,
            animation: `dust ${14 + (i % 7)}s linear ${i * 0.9}s infinite`,
            opacity: 0.25 + (i % 4) * 0.08,
            filter: "blur(0.4px)",
          }}
        />
      ))}
    </div>
  );
}
