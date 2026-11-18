import { emit, listen, UnlistenFn } from "@tauri-apps/api/event";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";
import type { TimerStateSnapshot } from "../types/timer";

export function isTauriEnv(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function setMainWindowAlwaysOnTop(alwaysOnTop: boolean): Promise<void> {
  if (!isTauriEnv()) return;
  try {
    const win = getCurrentWindow();
    await win.setAlwaysOnTop(alwaysOnTop);
  } catch (err) {
    console.warn("Failed to set alwaysOnTop:", err);
  }
}

export async function hideToTray(): Promise<void> {
  if (!isTauriEnv()) return;
  try {
    const win = getCurrentWindow();
    await win.hide();
  } catch (err) {
    console.warn("Failed to hide window:", err);
  }
}

export async function quitApp(): Promise<void> {
  if (!isTauriEnv()) {
    window.close();
    return;
  }
  try {
    await emit("app:quit");
    const overlay = await Window.getByLabel("overlay");
    if (overlay) await overlay.destroy();
    const win = getCurrentWindow();
    await win.destroy();
  } catch (err) {
    console.warn("Failed to quit app:", err);
  }
}

export async function setOverlayWindowVisible(visible: boolean): Promise<void> {
  if (!isTauriEnv()) return;
  try {
    const overlay = await Window.getByLabel("overlay");
    if (!overlay) return;
    if (visible) {
      await overlay.show();
      await overlay.setFocus();
    } else {
      await overlay.hide();
    }
  } catch (err) {
    console.warn("Failed to toggle overlay window:", err);
  }
}

export async function broadcastTimerState(snapshot: TimerStateSnapshot): Promise<void> {
  if (!isTauriEnv()) return;
  try {
    await emit("timer:state", snapshot);
  } catch {
    // ignore in non-Tauri environments
  }
}

export async function emitOverlayDismiss(): Promise<void> {
  if (!isTauriEnv()) return;
  try {
    await emit("overlay:dismiss");
  } catch {
    // ignore
  }
}

export async function subscribeTimerState(
  handler: (snapshot: TimerStateSnapshot) => void
): Promise<UnlistenFn> {
  if (!isTauriEnv()) return () => {};
  return listen<TimerStateSnapshot>("timer:state", (event) => {
    handler(event.payload);
  });
}

export async function subscribeOverlayDismiss(handler: () => void): Promise<UnlistenFn> {
  if (!isTauriEnv()) return () => {};
  return listen("overlay:dismiss", () => {
    handler();
  });
}

export async function subscribeTrayActions(handlers: {
  onTogglePlayPause: () => void;
  onStopReset: () => void;
}): Promise<UnlistenFn[]> {
  if (!isTauriEnv()) return [];
  const u1 = await listen("tray:play-pause", () => handlers.onTogglePlayPause());
  const u2 = await listen("tray:stop-reset", () => handlers.onStopReset());
  return [u1, u2];
}
