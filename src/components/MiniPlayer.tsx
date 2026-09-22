import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, X } from "lucide-react";
import { useApp } from "@/context/app-context";
import { formatTime } from "@/lib/utils";
import { Waveform } from "@/components/Waveform";

export function MiniPlayer() {
  const {
    session,
    playing,
    setPlaying,
    progress,
    closeSession,
    page,
  } = useApp();

  if (!session || page === "home") return null;

  const title =
    session.type === "playlist"
      ? session.playlist.tracks[session.trackIndex]?.title
      : session.meditation.title;
  const sub =
    session.type === "playlist"
      ? session.playlist.title
      : session.meditation.subtitle;
  const total =
    session.type === "playlist"
      ? session.playlist.tracks[session.trackIndex]?.durationSec ?? 0
      : session.meditation.durationSec;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass relative mx-auto mb-3 flex w-full max-w-[420px] items-center gap-3 rounded-2xl px-3 py-2.5"
      >
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink"
          aria-label={playing ? "Pozastavit" : "Přehrát"}
        >
          {playing ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 translate-x-[1px] fill-current" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium">{title}</p>
          <p className="truncate text-[11px] text-white/40">{sub}</p>
          <div className="mt-1.5 h-[2px] overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white/70"
              style={{ width: `${Math.min(100, (progress / total) * 100)}%` }}
            />
          </div>
        </div>
        <Waveform bars={8} active={playing} className="h-6 w-12 shrink-0" />
        <span className="w-10 shrink-0 text-right text-[10px] tabular-nums text-white/35">
          {formatTime(progress)}
        </span>
        <button
          type="button"
          onClick={closeSession}
          className="grid h-8 w-8 place-items-center rounded-full text-white/40 hover:text-white"
          aria-label="Ukončit"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
