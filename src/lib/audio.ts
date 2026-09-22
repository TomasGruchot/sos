const SRC = {
  calm: "/audio/calm/uklidnit.m4a",
  energize: "/audio/energize/nabudit.m4a",
} as const;

const warmed = new Set<string>();

/** Stáhne track do HTTP cache, aby play() naskočil bez čekání. */
export function warmAudio(src: string) {
  if (typeof document === "undefined" || warmed.has(src)) return;
  warmed.add(src);

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "audio";
  link.href = src;
  document.head.appendChild(link);

  const el = new Audio();
  el.preload = "auto";
  el.src = src;
  el.load();
}

export function warmQuickModes() {
  warmAudio(SRC.calm);
  warmAudio(SRC.energize);
}

export function sameSrc(current: string, next: string) {
  return current === next || current.endsWith(next);
}
