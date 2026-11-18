import React, { useEffect, useState } from "react";
import { Titlebar } from "./components/Titlebar";
import { StopwatchView } from "./components/StopwatchView";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { RestOverlayView } from "./components/RestOverlayView";
import { useSettings } from "./hooks/useSettings";
import { useTimer } from "./hooks/useTimer";
import type { TimerStateSnapshot } from "./types/timer";
import {
  emitOverlayDismiss,
  isTauriEnv,
  subscribeTimerState,
} from "./utils/tauri";

const OverlayWindowRoot: React.FC = () => {
  const [snapshot, setSnapshot] = useState<TimerStateSnapshot>({
    status: "running",
    phase: "rest",
    currentIteration: 1,
    totalIterations: 8,
    remainingSeconds: 15 * 60,
    totalPhaseSeconds: 15 * 60,
    strictOverlay: false,
    overlayDismissed: false,
  });

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    subscribeTimerState((next) => {
      setSnapshot(next);
    }).then((fn) => {
      unlisten = fn;
    });
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  return (
    <RestOverlayView
      remainingSeconds={snapshot.remainingSeconds}
      totalPhaseSeconds={snapshot.totalPhaseSeconds}
      currentIteration={snapshot.currentIteration}
      totalIterations={snapshot.totalIterations}
      strictOverlay={snapshot.strictOverlay}
      onDismiss={() => {
        emitOverlayDismiss();
      }}
    />
  );
};

export const App: React.FC = () => {
  const isOverlayWindow =
    typeof window !== "undefined" && window.location.hash === "#overlay";

  if (isOverlayWindow) {
    return <OverlayWindowRoot />;
  }

  return <MainWindowRoot />;
};

const MainWindowRoot: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const {
    status,
    phase,
    currentIteration,
    totalIterations,
    remainingSeconds,
    totalPhaseSeconds,
    shouldShowOverlay,
    togglePlayPause,
    stopReset,
    dismissOverlay,
  } = useTimer(settings);

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-zinc-100 overflow-hidden">
      <div className="relative flex flex-col w-full h-full max-w-[340px] max-h-[460px] bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl">
        <Titlebar
          alwaysOnTop={settings.alwaysOnTop}
          onToggleAlwaysOnTop={() =>
            updateSettings({ alwaysOnTop: !settings.alwaysOnTop })
          }
          settingsOpen={settingsOpen}
          onToggleSettings={() => setSettingsOpen((prev) => !prev)}
        />

        {settingsOpen ? (
          <SettingsDrawer
            settings={settings}
            onUpdateSettings={updateSettings}
            onClose={() => setSettingsOpen(false)}
          />
        ) : (
          <StopwatchView
            status={status}
            phase={phase}
            currentIteration={currentIteration}
            totalIterations={totalIterations}
            remainingSeconds={remainingSeconds}
            totalPhaseSeconds={totalPhaseSeconds}
            settings={settings}
            onUpdateSettings={updateSettings}
            onTogglePlayPause={togglePlayPause}
            onStopReset={stopReset}
          />
        )}

        {/* In non-Tauri browser preview, render RestOverlayView inline when active */}
        {!isTauriEnv() && shouldShowOverlay && (
          <RestOverlayView
            remainingSeconds={remainingSeconds}
            totalPhaseSeconds={totalPhaseSeconds}
            currentIteration={currentIteration}
            totalIterations={totalIterations}
            strictOverlay={settings.strictOverlay}
            onDismiss={dismissOverlay}
          />
        )}
      </div>
    </div>
  );
};

export default App;
