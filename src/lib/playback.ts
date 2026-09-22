import {
  meditationById,
  playlistById,
  type Meditation,
  type Mode,
  type Playlist,
} from "@/data/content";
import type { Session } from "@/context/app-context";

const KEY = "soos.playback";

export type PlaybackSnapshot =
  | {
      kind: "playlist";
      playlistId: string;
      trackIndex: number;
      time: number;
      playing: boolean;
    }
  | {
      kind: "meditation";
      meditationId: string;
      time: number;
      playing: boolean;
    };

export type RestoredPlayback = {
  session: Exclude<Session, null>;
  mode: Mode;
  time: number;
  playing: boolean;
};

export function readPlayback(): PlaybackSnapshot | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PlaybackSnapshot;
    if (!data || typeof data.time !== "number" || data.time < 0) return null;
    if (data.kind === "playlist" && typeof data.playlistId === "string") return data;
    if (data.kind === "meditation" && typeof data.meditationId === "string") return data;
    return null;
  } catch {
    return null;
  }
}

export function writePlayback(snapshot: PlaybackSnapshot | null) {
  try {
    if (!snapshot) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    /* private mode */
  }
}

export function snapshotFrom(
  session: Session,
  time: number,
  playing: boolean,
): PlaybackSnapshot | null {
  if (!session) return null;
  const safeTime = Number.isFinite(time) && time > 0 ? time : 0;
  if (session.type === "playlist") {
    return {
      kind: "playlist",
      playlistId: session.playlist.id,
      trackIndex: session.trackIndex,
      time: safeTime,
      playing,
    };
  }
  return {
    kind: "meditation",
    meditationId: session.meditation.id,
    time: safeTime,
    playing,
  };
}

export function restorePlayback(): RestoredPlayback | null {
  const saved = readPlayback();
  if (!saved) return null;
  if (saved.kind === "playlist") return restorePlaylist(saved);
  return restoreMeditation(saved);
}

function restorePlaylist(
  saved: Extract<PlaybackSnapshot, { kind: "playlist" }>,
): RestoredPlayback | null {
  const playlist: Playlist | undefined = playlistById(saved.playlistId);
  if (!playlist || playlist.tracks.length === 0) return null;
  const trackIndex = Math.max(0, Math.min(saved.trackIndex, playlist.tracks.length - 1));
  return {
    session: { type: "playlist", playlist, trackIndex },
    mode: playlist.mode,
    time: saved.time,
    playing: saved.playing,
  };
}

function restoreMeditation(
  saved: Extract<PlaybackSnapshot, { kind: "meditation" }>,
): RestoredPlayback | null {
  const meditation: Meditation | undefined = meditationById(saved.meditationId);
  if (!meditation) return null;
  return {
    session: { type: "meditation", meditation },
    mode: "calm",
    time: saved.time,
    playing: saved.playing,
  };
}
