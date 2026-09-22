import { useEffect, useState, type ReactNode } from "react";

export function Clock({ leading }: { leading?: ReactNode }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="flex items-center justify-between gap-3 pt-[max(18px,env(safe-area-inset-top))]">
      <div className="min-h-9 min-w-9">{leading}</div>
      <p className="font-geo text-[13px] tabular-nums tracking-[0.18em] text-white/40">
        {time}
      </p>
    </header>
  );
}
