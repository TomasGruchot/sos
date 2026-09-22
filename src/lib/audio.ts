const SRC = {
  calm: "/audio/calm/uklidnit.m4a",
  energize: "/audio/energize/nabudit.m4a",
  rescue: "/audio/rescue/zachranny-plan.mp3",
} as const;

/** Stejný název používá service worker (CacheFirst + range). */
export const AUDIO_CACHE = "sos-audio";

export function warmQuickModes() {
  void cacheAudioOffline(Object.values(SRC));
}

/** Uloží celé soubory do Cache Storage, aby šly přehrát offline i se Range requesty. */
export async function cacheAudioOffline(srcs: readonly string[]) {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(AUDIO_CACHE);
    await Promise.all(
      srcs.map(async (src) => {
        const hit = await cache.match(src);
        if (hit) return;
        const res = await fetch(src);
        if (!res.ok) return;
        await cache.put(src, res.clone());
      }),
    );
  } catch {
    /* offline nebo omezené úložiště */
  }
}

export function sameSrc(current: string, next: string) {
  return current === next || current.endsWith(next);
}
