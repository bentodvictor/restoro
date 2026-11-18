import { useState, useEffect, useRef, useCallback } from "react";
import type {
  RestoroSettings,
  TimerPhase,
  TimerStatus,
  TimerStateSnapshot,
} from "../types/timer";
import { playChime } from "../utils/sound";
import {
  broadcastTimerState,
  setOverlayWindowVisible,
  subscribeOverlayDismiss,
  subscribeTrayActions,
} from "../utils/tauri";

export function useTimer(settings: RestoroSettings) {
  const [status, setStatus] = useState<TimerStatus>("stopped");
  const [phase, setPhase] = useState<TimerPhase>("work");
  const [currentIteration, setCurrentIteration] = useState<number>(1);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    settings.workMinutes * 60
  );
  const [overlayDismissed, setOverlayDismissed] = useState<boolean>(false);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const stateRef = useRef({
    status,
    phase,
    currentIteration,
    remainingSeconds,
    overlayDismissed,
  });
  stateRef.current = {
    status,
    phase,
    currentIteration,
    remainingSeconds,
    overlayDismissed,
  };

  // Sync remainingSeconds when edited while stopped
  useEffect(() => {
    if (status === "stopped") {
      setPhase("work");
      setCurrentIteration(1);
      setRemainingSeconds(settings.workMinutes * 60);
      setOverlayDismissed(false);
    }
  }, [settings.workMinutes, settings.restMinutes, settings.iterations, status]);

  const totalPhaseSeconds =
    phase === "work" ? settings.workMinutes * 60 : settings.restMinutes * 60;

  // Manage Tauri overlay window visibility and state broadcast
  useEffect(() => {
    const shouldShowOverlay =
      status !== "stopped" &&
      phase === "rest" &&
      settings.restOverlayEnabled &&
      (!overlayDismissed || settings.strictOverlay);

    setOverlayWindowVisible(shouldShowOverlay);

    const snapshot: TimerStateSnapshot = {
      status,
      phase,
      currentIteration,
      totalIterations: settings.iterations,
      remainingSeconds,
      totalPhaseSeconds,
      strictOverlay: settings.strictOverlay,
      overlayDismissed,
    };
    broadcastTimerState(snapshot);
  }, [
    status,
    phase,
    currentIteration,
    remainingSeconds,
    totalPhaseSeconds,
    overlayDismissed,
    settings.iterations,
    settings.restOverlayEnabled,
    settings.strictOverlay,
  ]);

  const dismissOverlay = useCallback(() => {
    if (settingsRef.current.strictOverlay) return;
    setOverlayDismissed(true);
    setOverlayWindowVisible(false);
  }, []);

  // Listen for dismiss events from the fullscreen overlay window
  useEffect(() => {
    let unlisten: (() => void) | undefined;
    subscribeOverlayDismiss(() => {
      dismissOverlay();
    }).then((fn) => {
      unlisten = fn;
    });
    return () => {
      if (unlisten) unlisten();
    };
  }, [dismissOverlay]);

  const togglePlayPause = useCallback(() => {
    const cur = stateRef.current;
    if (cur.status === "stopped") {
      setPhase("work");
      setCurrentIteration(1);
      setRemainingSeconds(settingsRef.current.workMinutes * 60);
      setOverlayDismissed(false);
      setStatus("running");
      playChime("work", settingsRef.current.soundEnabled);
    } else if (cur.status === "running") {
      setStatus("paused");
    } else {
      setStatus("running");
    }
  }, []);

  const stopReset = useCallback(() => {
    setStatus("stopped");
    setPhase("work");
    setCurrentIteration(1);
    setRemainingSeconds(settingsRef.current.workMinutes * 60);
    setOverlayDismissed(false);
    setOverlayWindowVisible(false);
  }, []);

  // Listen for system tray menu actions
  useEffect(() => {
    let unlisteners: Array<() => void> = [];
    subscribeTrayActions({
      onTogglePlayPause: togglePlayPause,
      onStopReset: stopReset,
    }).then((fns) => {
      unlisteners = fns;
    });
    return () => {
      unlisteners.forEach((fn) => fn());
    };
  }, [togglePlayPause, stopReset]);

  // Drift-corrected 1-second tick loop
  useEffect(() => {
    if (status !== "running") return;

    let expected = Date.now() + 1000;
    let timeoutId: number;

    const tick = () => {
      const now = Date.now();
      const cur = stateRef.current;
      const cfg = settingsRef.current;

      if (cur.remainingSeconds > 1) {
        setRemainingSeconds(cur.remainingSeconds - 1);
      } else {
        // Phase reached 00:00 -> transition!
        if (cur.phase === "work") {
          setPhase("rest");
          setRemainingSeconds(cfg.restMinutes * 60);
          setOverlayDismissed(false);
          playChime("rest", cfg.soundEnabled);
        } else {
          // Rest phase finished
          if (cur.currentIteration < cfg.iterations) {
            setCurrentIteration(cur.currentIteration + 1);
            setPhase("work");
            setRemainingSeconds(cfg.workMinutes * 60);
            setOverlayDismissed(false);
            playChime("work", cfg.soundEnabled);
          } else {
            // All iterations complete!
            setStatus("stopped");
            setPhase("work");
            setCurrentIteration(1);
            setRemainingSeconds(cfg.workMinutes * 60);
            setOverlayDismissed(false);
            playChime("complete", cfg.soundEnabled);
            return;
          }
        }
      }

      expected += 1000;
      const delay = Math.max(50, expected - now);
      timeoutId = window.setTimeout(tick, delay);
    };

    timeoutId = window.setTimeout(tick, 1000);
    return () => window.clearTimeout(timeoutId);
  }, [status]);

  const shouldShowOverlay =
    status !== "stopped" &&
    phase === "rest" &&
    settings.restOverlayEnabled &&
    (!overlayDismissed || settings.strictOverlay);

  return {
    status,
    phase,
    currentIteration,
    totalIterations: settings.iterations,
    remainingSeconds,
    totalPhaseSeconds,
    shouldShowOverlay,
    togglePlayPause,
    stopReset,
    dismissOverlay,
  };
}
