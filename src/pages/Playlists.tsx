import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useApp } from "@/context/app-context";
import { playlists, totalDuration, type Mode, type Playlist } from "@/data/content";
import { cn, formatTime } from "@/lib/utils";

function Cover({ playlist, featured = false }: { playlist: Playlist; featured?: boolean }) {
  const calm = playlist.mode === "calm";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px]",
        featured ? "aspect-[4/5] sm:aspect-[5/6]" : "aspect-[4/5]",
      )}
      style={{
        background: calm
          ? `linear-gradient(160deg, oklch(0.38 0.08 240), oklch(0.16 0.04 280) 70%)`
          : `linear-gradient(160deg, oklch(0.55 0.12 70), oklch(0.22 0.06 40) 72%)`,
      }}
    >
      <span className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <span className="absolute bottom-6 left-5 right-5">
        <span className="font-display text-[28px] italic leading-none text-white/90">
          {playlist.title}
        </span>
      </span>
      <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Play className="h-3.5 w-3.5 translate-x-[1px] fill-current" />
      </span>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-[12px] font-medium tracking-wide transition-colors",
        active ? "bg-white text-ink" : "bg-white/6 text-white/50 hover:text-white/80",
      )}
    >
      {label}
    </button>
  );
}

export function PlaylistsPage() {
  const { startPlaylist } = useApp();
  const [filter, setFilter] = useState<Mode | "all">("all");
  const visible =
    filter === "all" ? playlists : playlists.filter((p) => p.mode === filter);

  return (
    <div className="flex flex-1 flex-col pt-[max(18px,env(safe-area-inset-top))]">
      <p className="font-geo text-[11px] font-semibold uppercase tracking-[0.38em] text-white/40">
        Hudba
      </p>
      <h1 className="mt-1 font-display text-[34px] italic leading-none">
        Playlisty
      </h1>
      <p className="mt-3 max-w-[280px] text-[13px] leading-relaxed text-white/40">
        Připravené nálady. Tracky doplníš později do <span className="text-white/60">/public/audio</span>.
      </p>

      <div className="mt-5 flex gap-2">
        <FilterChip
          label="Vše"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterChip
          label="Klid"
          active={filter === "calm"}
          onClick={() => setFilter("calm")}
        />
        <FilterChip
          label="Energie"
          active={filter === "energize"}
          onClick={() => setFilter("energize")}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 pb-6">
        {visible.map((playlist, i) => {
          const featured = i === 0;
          return (
            <motion.button
              key={playlist.id}
              type="button"
              onClick={() => startPlaylist(playlist)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={cn("group text-left", featured && "col-span-2")}
            >
              <div className={featured ? "grid grid-cols-[1.15fr_1fr] gap-3" : ""}>
                <Cover playlist={playlist} featured={featured} />
                {featured && (
                  <div className="glass flex flex-col justify-end rounded-[22px] p-4 text-left">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                      {playlist.mode === "calm" ? "Klid" : "Energie"}
                    </p>
                    <p className="mt-2 font-geo text-[20px] font-semibold leading-tight">
                      {playlist.title}
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-white/45">
                      {playlist.subtitle}
                    </p>
                    <p className="mt-4 text-[11px] text-white/30">
                      {playlist.tracks.length} skladeb · {formatTime(totalDuration(playlist.tracks))}
                    </p>
                  </div>
                )}
              </div>
              {!featured && (
                <>
                  <p className="mt-2.5 truncate text-[13px] font-medium">{playlist.title}</p>
                  <p className="truncate text-[11px] text-white/40">
                    {playlist.tracks.length} skladeb · {formatTime(totalDuration(playlist.tracks))}
                  </p>
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
