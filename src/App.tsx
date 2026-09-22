import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientScene } from "@/components/AmbientScene";
import { BottomNav } from "@/components/BottomNav";
import { MiniPlayer } from "@/components/MiniPlayer";
import { AppContext, type Session } from "@/context/app-context";
import {
  type Mode,
  type Page,
  type Playlist,
  type Meditation,
} from "@/data/content";
import { sameSrc } from "@/lib/audio";
import { restorePlayback, snapshotFrom, writePlayback } from "@/lib/playback";
import { Home } from "@/pages/Home";
import { PlaylistsPage } from "@/pages/Playlists";
import { MeditationsPage } from "@/pages/Meditations";
import { usePwa } from "@/context/pwa-context";
import { InstallGate } from "@/components/InstallGate";
import { InstallHint } from "@/components/InstallHint";

function currentDuration(session: Session) {
  if (!session) return 0;
  if (session.type === "meditation") return session.meditation.durationSec;
  return session.playlist.tracks[session.trackIndex]?.durationSec ?? 0;
}

function currentSrc(session: Session) {
  if (!session) return undefined;
  if (session.type === "meditation") return session.meditation.src;
  return session.playlist.tracks[session.trackIndex]?.src;
}

const pageMotion = {
  initial: { opacity: 0, y: 16, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(8px)" },
};

export default function App() {
  const [boot] = useState(restorePlayback);
  const [page, setPage] = useState<Page>("home");
  const [mode, setMode] = useState<Mode | null>(boot?.mode ?? null);
  const [choosing, setChoosing] = useState(false);
  const [session, setSession] = useState<Session>(boot?.session ?? null);
  const [playing, setPlaying] = useState(boot?.playing ?? false);
  const [progress, setProgress] = useState(boot?.time ?? 0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const resumeAt = useRef<number | null>(boot && boot.time > 0 ? boot.time : null);
  const playingRef = useRef(playing);
  const sessionRef = useRef(session);
  const progressRef = useRef(progress);
  playingRef.current = playing;
  sessionRef.current = session;
  progressRef.current = progress;
  const { showGate } = usePwa();

  const applyResume = useCallback((el: HTMLAudioElement) => {
    if (resumeAt.current == null) return false;
    const target = resumeAt.current;
    const max =
      Number.isFinite(el.duration) && el.duration > 0
        ? Math.max(0, el.duration - 0.25)
        : target;
    const next = Math.min(Math.max(0, target), max);
    resumeAt.current = null;
    if (Math.abs((el.currentTime || 0) - next) > 0.05) el.currentTime = next;
    setProgress(next);
    return true;
  }, []);

  const attachAndPlay = useCallback((src: string | undefined) => {
    const el = audioRef.current;
    if (!el || !src) return;
    if (!sameSrc(el.getAttribute("src") ?? el.src, src)) {
      el.src = src;
    }
    el.currentTime = 0;
    void el.play().catch(() => undefined);
  }, []);

  const startPlaylist = useCallback((playlist: Playlist, trackIndex = 0) => {
    resumeAt.current = null;
    setMode(playlist.mode);
    setChoosing(false);
    setSession({ type: "playlist", playlist, trackIndex });
    setProgress(0);
    setMediaDuration(0);
    setPlaying(true);
    attachAndPlay(playlist.tracks[trackIndex]?.src);
  }, [attachAndPlay]);

  const startMeditation = useCallback((meditation: Meditation) => {
    resumeAt.current = null;
    setMode("calm");
    setChoosing(false);
    setSession({ type: "meditation", meditation });
    setProgress(0);
    setMediaDuration(0);
    setPlaying(true);
    attachAndPlay(meditation.src);
  }, [attachAndPlay]);

  const closeSession = useCallback(() => {
    resumeAt.current = null;
    setSession(null);
    setPlaying(false);
    setProgress(0);
    setMediaDuration(0);
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
    }
  }, []);

  const nextTrack = useCallback(() => {
    setSession((current) => {
      if (!current || current.type !== "playlist") return current;
      if (current.trackIndex >= current.playlist.tracks.length - 1) {
        setPlaying(false);
        return current;
      }
      setProgress(0);
      return { ...current, trackIndex: current.trackIndex + 1 };
    });
  }, []);

  const prevTrack = useCallback(() => {
    setProgress(0);
    setSession((current) => {
      if (!current || current.type !== "playlist") return current;
      return {
        ...current,
        trackIndex: Math.max(0, current.trackIndex - 1),
      };
    });
    setPlaying(true);
  }, []);

  const restart = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.currentTime = 0;
      void el.play().catch(() => undefined);
    }
    setProgress(0);
    setPlaying(true);
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => {
      if (resumeAt.current != null) return;
      setProgress(el.currentTime || 0);
    };
    const onMeta = () => {
      const next = el.duration;
      setMediaDuration(Number.isFinite(next) ? next : 0);
      if (!applyResume(el)) return;
      if (playingRef.current) void el.play().catch(() => setPlaying(false));
      else el.pause();
    };
    const onEnded = () => {
      setSession((current) => {
        if (!current) return current;
        if (
          current.type === "playlist" &&
          current.trackIndex < current.playlist.tracks.length - 1
        ) {
          setProgress(0);
          setPlaying(true);
          return { ...current, trackIndex: current.trackIndex + 1 };
        }
        setPlaying(false);
        const end = Number.isFinite(el.duration) ? el.duration : currentDuration(current);
        setProgress(end);
        return current;
      });
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    el.addEventListener("ended", onEnded);
    el.addEventListener("seeked", onTime);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("seeked", onTime);
    };
  }, [applyResume]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const src = currentSrc(session);
    if (!src) {
      el.pause();
      return;
    }
    if (!sameSrc(el.getAttribute("src") ?? el.src, src)) {
      setMediaDuration(0);
      el.src = src;
    }
    if (resumeAt.current != null) {
      if (el.readyState < 1) return;
      applyResume(el);
    }
    if (playing) void el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [session, playing, applyResume]);

  const progressSecond = Math.floor(progress);

  useEffect(() => {
    const time = resumeAt.current ?? audioRef.current?.currentTime ?? progress;
    writePlayback(snapshotFrom(session, time, playing));
  }, [session, playing, progressSecond]);

  useEffect(() => {
    const save = () => {
      const time = resumeAt.current ?? audioRef.current?.currentTime ?? progressRef.current;
      writePlayback(snapshotFrom(sessionRef.current, time, playingRef.current));
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") save();
    };
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", save);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (!session) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = "none";
      return;
    }
    const title =
      session.type === "playlist"
        ? (session.playlist.tracks[session.trackIndex]?.title ?? session.playlist.title)
        : session.meditation.title;
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: "SOS",
      album: "SOS",
    });
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    try {
      navigator.mediaSession.setActionHandler("play", () => setPlaying(true));
      navigator.mediaSession.setActionHandler("pause", () => setPlaying(false));
    } catch {
      /* prohlížeč akci nepodporuje */
    }
  }, [session, playing]);

  const value = useMemo(
    () => ({
      page,
      setPage: (next: Page) => {
        setPage(next);
        if (next !== "home") setChoosing(false);
        window.scrollTo({ top: 0, behavior: "auto" });
      },
      mode,
      setMode,
      choosing,
      setChoosing,
      session,
      startPlaylist,
      startMeditation,
      nextTrack,
      prevTrack,
      restart,
      closeSession,
      playing,
      setPlaying,
      progress,
      setProgress,
      mediaDuration,
    }),
    [
      page,
      mode,
      choosing,
      session,
      startPlaylist,
      startMeditation,
      nextTrack,
      prevTrack,
      restart,
      closeSession,
      playing,
      progress,
      mediaDuration,
    ],
  );

  const inPlayer = page === "home" && Boolean(session);
  const showBottomNav = false;
  const showDock = !showGate && !inPlayer && (showBottomNav || Boolean(session));
  const dockPad = inPlayer
    ? "pb-8"
    : session
      ? showBottomNav
        ? "pb-56"
        : "pb-28"
      : showBottomNav
        ? "pb-36"
        : "pb-[max(18px,env(safe-area-inset-bottom))]";

  return (
    <AppContext.Provider value={value}>
      <div className="relative min-h-svh">
        <div className="pointer-events-none fixed inset-0">
          <AmbientScene mode={mode} intense={Boolean(session)} />
        </div>
        <div className="noise" />

        <main className="relative z-10">
          <div className={`mx-auto flex min-h-svh w-full max-w-[480px] flex-col px-5 ${dockPad}`}>
            <AnimatePresence mode="wait">
              {showGate && (
                <motion.div
                  key="install"
                  className="flex flex-1 flex-col"
                  variants={pageMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <InstallGate />
                </motion.div>
              )}
              {!showGate && page === "home" && (
                <motion.div
                  key="home"
                  className="flex flex-1 flex-col"
                  variants={pageMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Home />
                </motion.div>
              )}
              {!showGate && page === "playlists" && (
                <motion.div
                  key="playlists"
                  className="flex flex-1 flex-col"
                  variants={pageMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <PlaylistsPage />
                </motion.div>
              )}
              {!showGate && page === "meditations" && (
                <motion.div
                  key="meditations"
                  className="flex flex-1 flex-col"
                  variants={pageMotion}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <MeditationsPage />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <InstallHint />

        {showDock && (
          <div className="fixed inset-x-0 bottom-0 z-50 px-5 pb-[max(18px,env(safe-area-inset-bottom))]">
            <div className="mx-auto max-w-[480px]">
              <MiniPlayer />
              {showBottomNav && <BottomNav page={page} onChange={value.setPage} />}
            </div>
          </div>
        )}

        <audio ref={audioRef} preload="auto" playsInline />
      </div>
    </AppContext.Provider>
  );
}
