import { cn } from "@/lib/utils";

type Props = {
  bars?: number;
  active?: boolean;
  className?: string;
};

export function Waveform({ bars = 48, active = true, className }: Props) {
  return (
    <div
      className={cn("flex h-10 w-full items-end gap-[2px]", className)}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => {
        const h = 22 + ((i * 47 + 13) % 78);
        return (
          <span
            key={i}
            className="eq-bar min-w-0 flex-1 rounded-full bg-white/75"
            style={{
              height: `${h}%`,
              animationDelay: `${(i * 0.05) % 0.85}s`,
              animationDuration: `${0.85 + (i % 6) * 0.14}s`,
              animationPlayState: active ? "running" : "paused",
              opacity: 0.28 + (i % 7) * 0.08,
            }}
          />
        );
      })}
    </div>
  );
}
