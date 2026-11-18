import React from "react";
import { Pin, Settings, Minus, X } from "lucide-react";
import { hideToTray, quitApp } from "../utils/tauri";

interface TitlebarProps {
  alwaysOnTop: boolean;
  onToggleAlwaysOnTop: () => void;
  settingsOpen: boolean;
  onToggleSettings: () => void;
}

export const Titlebar: React.FC<TitlebarProps> = ({
  alwaysOnTop,
  onToggleAlwaysOnTop,
  settingsOpen,
  onToggleSettings,
}) => {
  return (
    <header
      data-tauri-drag-region
      className="flex items-center justify-between h-10 px-3 bg-zinc-950/90 border-b border-zinc-800/80 select-none"
    >
      <div
        data-tauri-drag-region
        className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-zinc-400"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
        <span data-tauri-drag-region>Restoro</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleAlwaysOnTop}
          title={alwaysOnTop ? "Unpin from top" : "Pin always-on-top"}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            alwaysOnTop
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70"
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onToggleSettings}
          title="Notification & Overlay Settings"
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            settingsOpen
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={hideToTray}
          title="Minimize to System Tray"
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 transition-colors cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={quitApp}
          title="Quit Restoro"
          className="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
