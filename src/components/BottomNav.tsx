import { motion } from "framer-motion";
import { Flower2, House, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Page } from "@/data/content";

const items: { id: Page; label: string; icon: typeof House }[] = [
  { id: "home", label: "Domů", icon: House },
  { id: "playlists", label: "Hudba", icon: Music2 },
  { id: "meditations", label: "Ticho", icon: Flower2 },
];

type Props = {
  page: Page;
  onChange: (page: Page) => void;
};

export function BottomNav({ page, onChange }: Props) {
  return (
    <nav aria-label="Hlavní menu" className="glass flex items-center justify-between rounded-full px-2 py-2">
      {items.map((item) => {
        const active = page === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "relative flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[12px] font-medium tracking-wide transition-colors",
              active ? "text-white" : "text-white/40 hover:text-white/70",
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-white/10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
              <span className="hidden sm:inline">{item.label}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
