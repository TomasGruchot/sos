import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, X } from "lucide-react";
import { useApp } from "@/context/app-context";
import { formatTime } from "@/lib/utils";
import { Waveform } from "@/components/Waveform";

export function SessionView() {
  const {
    session,
    playing,
    setPlaying,
    progress,
    restart,
    closeSession,
  } = useApp();

  if (!session) return null;

  const isPlaylist = session.type === "playlist";
  const total = isPlaylist
    ? session.playlist.tracks[session.trackIndex]?.durationSec ?? 0
    : session.meditation.durationSec;
  const pct = total ? Math.min(100, (progress / total) * 100) : 0;

  return (
    <motion.section
      className="flex flex-1 flex-col items-center justify-center px-2 pb-10 pt-4"
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={closeSession}
        className="mb-8 flex items-center gap-2 self-start text-[12px] uppercase tracking-[0.22em] text-white/40 transition-colors hover:text-white/70"
      >
        <X className="h-3.5 w-3.5" />
        zpět
      </button>

      <div className="relative mb-10 grid place-items-center">
        <span
          className="absolute h-56 w-56 rounded-full blur-3xl"
          style={{
            background: isPlaylist
              ? session.playlist.mode === "energize"
                ? "oklch(0.7 0.14 70 / 0.28)"
                : "oklch(0.6 0.12 240 / 0.3)"
              : "oklch(0.65 0.08 200 / 0.28)",
            animation: "breathe 6s ease-in-out infinite",
          }}
        />
        <motion.div
          className="relative grid h-44 w-44 place-items-center rounded-full"
          animate={
            !isPlaylist && playing
              ? { scale: [1, 1.08, 1] }
              : { scale: 1 }
          }
          transition={
            !isPlaylist && playing
              ? { duration: 8, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.4 }
          }
          style={{
            background:
              "radial-gradient(circle at 32% 28%, oklch(1 0 0 / 0.28), transparent 40%), linear-gradient(180deg, oklch(1 0 0 / 0.08), oklch(1 0 0 / 0.02))",
            boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.2), 0 20px 50px oklch(0 0 0 / 0.35)",
          }}
        >
          <span className="absolute inset-0 rounded-full border border-white/15" />
          <span className="absolute -inset-3 rounded-full border border-white/5" />
          <p className="font-display text-[22px] italic tracking-[0.2em] text-white/80">
            {isPlaylist ? "SOS" : playing ? "nádech" : "ticho"}
          </p>
        </motion.div>
      </div>

      <Waveform active={playing} className="mt-10 h-12 w-full max-w-[320px]" />

      <div className="mt-6 w-full max-w-[320px]">
        <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-white"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] tabular-nums text-white/35">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(total)}</span>
        </div>
      </div>

      <div className="mt-10 flex w-full justify-center">
        <div className="glass flex items-center gap-1 rounded-full p-1.5 pl-2">
          <button
            type="button"
            onClick={restart}
            className="grid h-12 w-12 place-items-center rounded-full text-white/55 transition-colors hover:text-white"
            aria-label="Od začátku"
          >
            <RotateCcw className="h-5 w-5" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="grid h-14 w-14 place-items-center rounded-full bg-white text-ink shadow-[0_8px_28px_oklch(1_0_0_/_0.16)]"
            aria-label={playing ? "Pozastavit" : "Přehrát"}
          >
            {playing ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            )}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
