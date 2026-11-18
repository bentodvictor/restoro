import React from "react";
import { Volume2, VolumeX, Monitor, Lock } from "lucide-react";
import type { RestoroSettings } from "../types/timer";
import { playChime } from "../utils/sound";

interface SettingsDrawerProps {
  settings: RestoroSettings;
  onUpdateSettings: (patch: Partial<RestoroSettings>) => void;
  onClose: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  return (
    <div className="flex flex-col flex-1 justify-between px-5 py-4 bg-zinc-950">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Transition & Rest Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* Sound Toggle */}
        <ToggleRow
          icon={
            settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )
          }
          title="Transition Sound"
          description="Play synthesized chime when switching between Work and Rest"
          checked={settings.soundEnabled}
          onChange={(checked) => {
            onUpdateSettings({ soundEnabled: checked });
            if (checked) playChime("work", true);
          }}
        />

        {/* Rest Overlay Toggle */}
        <ToggleRow
          icon={<Monitor className="w-4 h-4 text-sky-400" />}
          title="Rest Screen Overlay"
          description="Show dimmed fullscreen overlay during the Rest period"
          checked={settings.restOverlayEnabled}
          onChange={(checked) => onUpdateSettings({ restOverlayEnabled: checked })}
        />

        {/* Strict Overlay Toggle */}
        <div className={settings.restOverlayEnabled ? "" : "opacity-40 pointer-events-none"}>
          <ToggleRow
            icon={<Lock className="w-4 h-4 text-amber-400" />}
            title="Strict Rest Mode"
            description="Hide the Dismiss button on the fullscreen Rest overlay"
            checked={settings.strictOverlay}
            onChange={(checked) => onUpdateSettings({ strictOverlay: checked })}
          />
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900/70 border border-zinc-800/80 p-3 text-[11px] text-zinc-400 leading-relaxed">
        All timer preferences and settings are saved automatically. Minimize (<code className="text-zinc-200">-</code>) hides Restoro to the system tray.
      </div>
    </div>
  );
};

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  icon,
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <label className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 cursor-pointer hover:border-zinc-700/80 transition-colors">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className="text-xs font-semibold text-zinc-200">{title}</div>
          <div className="text-[11px] text-zinc-400 leading-snug mt-0.5">
            {description}
          </div>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
          checked ? "bg-emerald-500" : "bg-zinc-700"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
};
