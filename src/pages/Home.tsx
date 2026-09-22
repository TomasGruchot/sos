import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SoosOrb } from "@/components/SoosOrb";
import { ModeChooser } from "@/components/ModeChooser";
import { SessionView } from "@/components/SessionView";
import { Clock } from "@/components/Clock";
import { InstallChip } from "@/components/InstallChip";
import { useApp } from "@/context/app-context";
import { quickModes } from "@/data/content";
import { warmQuickModes } from "@/lib/audio";

export function Home() {
  const {
    choosing,
    setChoosing,
    mode,
    session,
    startPlaylist,
  } = useApp();

  useEffect(() => {
    const id = window.setTimeout(() => warmQuickModes(), 300);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (choosing) warmQuickModes();
  }, [choosing]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {!session && <Clock leading={<InstallChip />} />}

      <AnimatePresence mode="wait">
        {session ? (
          <SessionView key="session" />
        ) : (
          <motion.div
            key="idle"
            className="flex flex-1 flex-col items-center justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SoosOrb
              open={choosing}
              mode={mode}
              onPress={() => setChoosing(!choosing)}
            />

            <div className="mt-10 w-full max-w-[360px]">
              <AnimatePresence>
                {choosing && (
                  <motion.div
                    key="chooser"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <ModeChooser
                      onChoose={(next) => startPlaylist(quickModes[next])}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
