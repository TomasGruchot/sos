import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Mode } from "@/data/content";

type Props = {
  onPress: () => void;
  open: boolean;
  mode: Mode | null;
};

export function SoosOrb({ onPress, open, mode }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 16, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 16, mass: 0.4 });
  const rotateX = useTransform(sy, [-40, 40], [8, -8]);
  const rotateY = useTransform(sx, [-40, 40], [-8, 8]);

  function onMove(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(e.clientX - (r.left + r.width / 2));
    my.set(e.clientY - (r.top + r.height / 2));
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onPress}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label="SOS — zvol směr"
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative grid place-items-center outline-none"
      initial={{ scale: 0.86, opacity: 0 }}
      animate={{
        scale: open ? 0.72 : 1,
        opacity: 1,
        y: open ? -12 : 0,
      }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
    >
      <span className="pointer-events-none absolute h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.08_230_/_0.18),transparent_62%)] blur-2xl" />
      <span
        className={cn(
          "pointer-events-none absolute h-[220px] w-[220px] rounded-full blur-3xl transition-colors duration-700",
          mode === "energize"
            ? "bg-[oklch(0.7_0.14_70_/_0.35)]"
            : mode === "calm"
              ? "bg-[oklch(0.62_0.12_240_/_0.38)]"
              : "bg-[oklch(0.7_0.08_80_/_0.22)]",
        )}
        style={{ animation: "breathe 5.5s ease-in-out infinite" }}
      />

      {!open && (
        <>
          <span className="pointer-events-none absolute h-[268px] w-[268px] rounded-full border border-white/10" />
          <span
            className="pointer-events-none absolute h-[268px] w-[268px] rounded-full border border-white/5"
            style={{ animation: "ring-pulse 4.8s ease-out infinite" }}
          />
        </>
      )}

      <span
        className={cn(
          "orb-ring pointer-events-none absolute h-[248px] w-[248px] rounded-full p-[1.5px]",
          mode === "calm" && "orb-ring-calm",
          mode === "energize" && "orb-ring-fire",
        )}
        style={{
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <span
        className="relative grid h-[212px] w-[212px] place-items-center rounded-full"
        style={{
          background: `
            radial-gradient(circle at 34% 28%, oklch(1 0 0 / 0.38), transparent 36%),
            radial-gradient(circle at 70% 78%, oklch(0.55 0.1 250 / 0.35), transparent 42%),
            linear-gradient(165deg, oklch(0.32 0.04 280 / 0.7), oklch(0.16 0.03 280 / 0.95))
          `,
          boxShadow: `
            0 30px 80px oklch(0 0 0 / 0.45),
            inset 0 1px 0 oklch(1 0 0 / 0.35),
            inset 0 -18px 30px oklch(0 0 0 / 0.35)
          `,
        }}
      >
        <span className="absolute inset-[10px] rounded-full border border-white/8" />
        <span className="relative z-10 flex flex-col items-center">
          <span className="font-display text-[42px] leading-none tracking-[0.38em] text-shine">
            SOS
          </span>
          <span className="mt-3 text-[10px] font-medium uppercase tracking-[0.42em] text-white/45">
            {open ? "zvol" : "stiskni"}
          </span>
        </span>
      </span>
    </motion.button>
  );
}
