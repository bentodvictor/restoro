import { useState, useEffect, useCallback } from "react";
import type { RestoroSettings } from "../types/timer";
import { setMainWindowAlwaysOnTop } from "../utils/tauri";

const STORAGE_KEY = "restoro:settings:v1";

export const DEFAULT_SETTINGS: RestoroSettings = {
  workMinutes: 45,
  restMinutes: 15,
  iterations: 8,
  soundEnabled: true,
  restOverlayEnabled: true,
  strictOverlay: false,
  alwaysOnTop: false,
};

function clampInt(val: unknown, min: number, max: number, fallback: number): number {
  const num = typeof val === "number" ? Math.round(val) : Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
}

function loadSettings(): RestoroSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<RestoroSettings>;
    return {
      workMinutes: clampInt(parsed.workMinutes, 1, 240, DEFAULT_SETTINGS.workMinutes),
      restMinutes: clampInt(parsed.restMinutes, 1, 120, DEFAULT_SETTINGS.restMinutes),
      iterations: clampInt(parsed.iterations, 1, 99, DEFAULT_SETTINGS.iterations),
      soundEnabled:
        typeof parsed.soundEnabled === "boolean"
          ? parsed.soundEnabled
          : DEFAULT_SETTINGS.soundEnabled,
      restOverlayEnabled:
        typeof parsed.restOverlayEnabled === "boolean"
          ? parsed.restOverlayEnabled
          : DEFAULT_SETTINGS.restOverlayEnabled,
      strictOverlay:
        typeof parsed.strictOverlay === "boolean"
          ? parsed.strictOverlay
          : DEFAULT_SETTINGS.strictOverlay,
      alwaysOnTop:
        typeof parsed.alwaysOnTop === "boolean"
          ? parsed.alwaysOnTop
          : DEFAULT_SETTINGS.alwaysOnTop,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<RestoroSettings>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore storage errors
    }
  }, [settings]);

  useEffect(() => {
    setMainWindowAlwaysOnTop(settings.alwaysOnTop);
  }, [settings.alwaysOnTop]);

  const updateSettings = useCallback((patch: Partial<RestoroSettings>) => {
    setSettings((prev) => {
      const next: RestoroSettings = { ...prev, ...patch };
      next.workMinutes = clampInt(next.workMinutes, 1, 240, prev.workMinutes);
      next.restMinutes = clampInt(next.restMinutes, 1, 120, prev.restMinutes);
      next.iterations = clampInt(next.iterations, 1, 99, prev.iterations);
      return next;
    });
  }, []);

  return {
    settings,
    updateSettings,
  };
}
