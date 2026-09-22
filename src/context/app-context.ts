import { createContext, useContext } from "react";
import type { Mode, Page, Playlist, Meditation } from "@/data/content";

export type Session =
  | { type: "playlist"; playlist: Playlist; trackIndex: number }
  | { type: "meditation"; meditation: Meditation }
  | null;

export type AppState = {
  page: Page;
  setPage: (page: Page) => void;
  mode: Mode | null;
  setMode: (mode: Mode | null) => void;
  choosing: boolean;
  setChoosing: (v: boolean) => void;
  session: Session;
  startPlaylist: (playlist: Playlist, trackIndex?: number) => void;
  startMeditation: (meditation: Meditation) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  restart: () => void;
  closeSession: () => void;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  progress: number;
  setProgress: (n: number) => void;
  mediaDuration: number;
};

export const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside App");
  return ctx;
}
