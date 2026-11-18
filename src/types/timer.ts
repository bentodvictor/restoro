export type TimerStatus = "stopped" | "running" | "paused";
export type TimerPhase = "work" | "rest";

export interface RestoroSettings {
  workMinutes: number;
  restMinutes: number;
  iterations: number;
  soundEnabled: boolean;
  restOverlayEnabled: boolean;
  strictOverlay: boolean;
  alwaysOnTop: boolean;
}

export interface TimerStateSnapshot {
  status: TimerStatus;
  phase: TimerPhase;
  currentIteration: number;
  totalIterations: number;
  remainingSeconds: number;
  totalPhaseSeconds: number;
  strictOverlay: boolean;
  overlayDismissed: boolean;
}
