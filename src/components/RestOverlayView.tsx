import React from "react";
import { Coffee, EyeOff } from "lucide-react";
import { formatTime } from "./StopwatchView";

interface RestOverlayViewProps {
  remainingSeconds: number;
  totalPhaseSeconds: number;
  currentIteration: number;
  totalIterations: number;
  strictOverlay: boolean;
  onDismiss: () => void;
}

export const RestOverlayView: React.FC<RestOverlayViewProps> = ({
  remainingSeconds,
  totalPhaseSeconds,
  currentIteration,
  totalIterations,
  strictOverlay,
  onDismiss,
}) => {
  const progress =
    totalPhaseSeconds > 0
      ? Math.min(1, Math.max(0, (totalPhaseSeconds - remainingSeconds) / totalPhaseSeconds))
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/92 backdrop-blur-md text-zinc-100 select-none p-6">
      <div className="flex flex-col items-center max-w-md w-full text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 mb-5">
          <Coffee className="w-7 h-7" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-sky-500/15 text-sky-300 border border-sky-500/30 mb-3">
          Rest Period · Iteration {currentIteration} / {totalIterations}
        </span>

        <h1 className="text-2xl font-bold text-zinc-100 mb-1">
          Step away and recharge
        </h1>
        <p className="text-sm text-zinc-400 mb-6">
          Relax your eyes and stretch until the next work cycle begins.
        </p>

        <div className="font-mono text-7xl font-bold tracking-tight text-zinc-100 tabular-nums mb-6">
          {formatTime(remainingSeconds)}
        </div>

        {/* Subtle progress bar */}
        <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-sky-400 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {!strictOverlay ? (
          <button
            type="button"
            onClick={onDismiss}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-800 transition-colors cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Dismiss Overlay (Keep Rest Timer Running)</span>
          </button>
        ) : (
          <span className="text-xs text-zinc-500 font-medium">
            Strict Rest Mode active — overlay unlocks when Rest finishes
          </span>
        )}
      </div>
    </div>
  );
};
