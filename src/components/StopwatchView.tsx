import React from "react";
import { Play, Pause, Square, Minus, Plus } from "lucide-react";
import type { RestoroSettings, TimerPhase, TimerStatus } from "../types/timer";

interface StopwatchViewProps {
  status: TimerStatus;
  phase: TimerPhase;
  currentIteration: number;
  totalIterations: number;
  remainingSeconds: number;
  totalPhaseSeconds: number;
  settings: RestoroSettings;
  onUpdateSettings: (patch: Partial<RestoroSettings>) => void;
  onTogglePlayPause: () => void;
  onStopReset: () => void;
}

export function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(clamped / 3600);
  const mins = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export const StopwatchView: React.FC<StopwatchViewProps> = ({
  status,
  phase,
  currentIteration,
  totalIterations,
  remainingSeconds,
  totalPhaseSeconds,
  settings,
  onUpdateSettings,
  onTogglePlayPause,
  onStopReset,
}) => {
  const isEditable = status === "stopped";
  const progress =
    totalPhaseSeconds > 0
      ? Math.min(1, Math.max(0, (totalPhaseSeconds - remainingSeconds) / totalPhaseSeconds))
      : 0;

  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const isWork = phase === "work";
  const accentColor = isWork ? "stroke-emerald-400" : "stroke-sky-400";
  const badgeClasses = isWork
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
    : "bg-sky-500/15 text-sky-300 border-sky-500/30";

  const totalCycleMinutes =
    (settings.workMinutes + settings.restMinutes) * settings.iterations;
  const totalCycleHours = (totalCycleMinutes / 60).toFixed(
    totalCycleMinutes % 60 === 0 ? 0 : 1
  );

  return (
    <div className="flex flex-col flex-1 justify-between px-5 py-4 bg-zinc-950">
      {/* Top Circular Readout */}
      <div className="flex flex-col items-center justify-center mt-1">
        <div className="relative flex items-center justify-center w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              strokeWidth="6"
              className="stroke-zinc-800/90"
            />
            <circle
              cx="96"
              cy="96"
              r={radius}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`${accentColor} transition-all duration-300`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded-full border mb-1.5 ${badgeClasses}`}
            >
              {status === "stopped"
                ? "Ready"
                : status === "paused"
                ? `${phase} · Paused`
                : phase}
            </span>

            <div className="font-mono text-4xl font-bold tracking-tight text-zinc-100 tabular-nums">
              {formatTime(remainingSeconds)}
            </div>

            <div className="mt-1.5 text-xs font-medium text-zinc-400">
              Iteration{" "}
              <span className="text-zinc-200 font-semibold">
                {currentIteration}
              </span>{" "}
              / {totalIterations}
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Numeric Inputs (Locked while Running/Paused) */}
      <div className="grid grid-cols-3 gap-2 my-2">
        <NumberField
          label="Work (m)"
          value={settings.workMinutes}
          min={1}
          max={240}
          disabled={!isEditable}
          onChange={(val) => onUpdateSettings({ workMinutes: val })}
        />
        <NumberField
          label="Rest (m)"
          value={settings.restMinutes}
          min={1}
          max={120}
          disabled={!isEditable}
          onChange={(val) => onUpdateSettings({ restMinutes: val })}
        />
        <NumberField
          label="Cycles"
          value={settings.iterations}
          min={1}
          max={99}
          disabled={!isEditable}
          onChange={(val) => onUpdateSettings({ iterations: val })}
        />
      </div>

      {/* Total Duration Summary */}
      <div className="text-center text-[11px] text-zinc-500 mb-2">
        Total session: <span className="text-zinc-300 font-medium">{totalCycleHours}h</span>{" "}
        ({settings.iterations} × {settings.workMinutes}m work + {settings.restMinutes}m rest)
      </div>

      {/* Strictly Two Buttons: Play/Pause and Stop/Reset */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onTogglePlayPause}
          className={`flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            status === "running"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
              : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
          }`}
        >
          {status === "running" ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{status === "paused" ? "Resume" : "Start"}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onStopReset}
          disabled={status === "stopped"}
          className="flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <Square className="w-4 h-4 fill-current" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
};

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({
  label,
  value,
  min,
  max,
  disabled,
  onChange,
}) => {
  return (
    <div
      className={`flex flex-col items-center rounded-xl bg-zinc-900/90 border border-zinc-800/90 px-2 py-2 transition-opacity ${
        disabled ? "opacity-55" : ""
      }`}
    >
      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
        {label}
      </span>
      <div className="flex items-center justify-between w-full">
        <button
          type="button"
          disabled={disabled || value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <Minus className="w-3 h-3" />
        </button>

        <input
          type="number"
          min={min}
          max={max}
          disabled={disabled}
          value={value}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            if (!Number.isNaN(parsed)) {
              onChange(parsed);
            }
          }}
          className="w-10 text-center font-mono text-sm font-semibold text-zinc-100 bg-transparent focus:outline-none"
        />

        <button
          type="button"
          disabled={disabled || value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
