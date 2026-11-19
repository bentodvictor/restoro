# Changelog

All notable changes to **Restoro** will be documented in this file.

## [0.1.0] - 2026-11-18

### Added
- **Minimal Pomodoro Stopwatch**: Configurable **Work (min)**, **Rest (min)**, and **Cycles (Iterations)** (defaults to `45m` Work / `15m` Rest / `8` Cycles = `8 hours`).
- **Two-Button Control Flow**: Strictly **Start / Pause** and **Stop / Reset** controls; inputs lock automatically while a timer session is active.
- **Continuous Cycle Progression**: Automatic transitions between `Work` and `Rest` phases across all configured cycles.
- **Fullscreen Rest Overlay**: Configurable dimmed break screen during `Rest` periods with optional **Strict Rest Mode** (hides Dismiss button until rest completes).
- **Synthesized Audio Alerts**: Built-in Web Audio API transition chimes for Work start, Rest start, and session completion.
- **Frameless Window & System Tray**:
  - Custom draggable titlebar with **Always-on-Top Pin** toggle, **Settings** drawer, **Minimize to Tray (`-`)**, and **Quit (`×`)**.
  - System Tray icon with left-click show/hide toggle and right-click context menu (`Show / Hide`, `Play / Pause`, `Stop / Reset`, `Quit`).
- **Multiplatform Bundling & CI/CD**: Tauri v2 configuration and GitHub Actions workflow for Windows (`.exe`, `.msi`), macOS (`.dmg`, `.app`), and Linux (`.deb`, `.rpm`, `.AppImage`).
