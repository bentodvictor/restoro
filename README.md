# Restoro

<p align="center">
  <strong>Ultra-minimal desktop Pomodoro & Rest stopwatch built with Tauri v2, React, TypeScript, and Tailwind CSS.</strong>
</p>

<p align="center">
  <a href="https://github.com/bentodvictor/restoro/actions/workflows/release.yml"><img src="https://github.com/bentodvictor/restoro/actions/workflows/release.yml/badge.svg" alt="Release Workflow" /></a>
  <a href="https://github.com/bentodvictor/restoro/releases"><img src="https://img.shields.io/github/v/release/bentodvictor/restoro?include_prereleases&label=release" alt="Latest Release" /></a>
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-10b981" alt="Platforms" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" /></a>
</p>

---

## Philosophy

Most Pomodoro apps are bloated with task managers, kanban boards, and complex interval rules. **Restoro** focuses strictly on **time and rest**:

1. Set your **Work** period (e.g., `45` minutes).
2. Set your **Rest** period (e.g., `15` minutes).
3. Set your **Cycles / Iterations** (e.g., `8` cycles = `8 hours` of structured work and rest).
4. Press **Start**.

No task lists. No skip-phase temptations. Just a sleek, distraction-free stopwatch that flows automatically through your work day.

---

## Key Features

- **Minimal Stopwatch Interface**: Compact (`340 × 460 px`) frameless dark-mode window with circular progress ring and crisp monospace countdown readout.
- **Strictly Two Controls**: **Start / Pause** and **Stop / Reset**. Duration and cycle steppers automatically lock while a session is active.
- **Continuous Cycle Progression**: Automatically transitions `Work -> Rest -> Work -> Rest` across all `N` cycles (including the final rest period).
- **Fullscreen Rest Overlay**:
  - Optional dimmed fullscreen break screen during the **Rest** phase showing the remaining break time and current cycle (`Iteration X / N`).
  - **Dismiss** option hides the fullscreen overlay while keeping the Rest countdown running in the main window.
  - **Strict Rest Mode** hides the Dismiss button until the Rest timer reaches `00:00`.
- **Synthesized Web Audio Chimes**: Zero external audio files. Built-in Web Audio API chimes with distinct pleasant tones for *Work Start*, *Rest Start*, and *Session Complete* (can be toggled on/off).
- **Desktop-First Ergonomics**:
  - **Always-on-Top Pin** toggle right in the titlebar.
  - **System Tray Integration**: Minimize (`-`) hides Restoro to the system tray; left-click the tray icon to toggle visibility, or right-click to `Show/Hide`, `Play/Pause`, `Stop/Reset`, or `Quit`.
  - **Automatic Persistence**: Remembers your last-used Work, Rest, Cycles, Sound, Overlay, Strict Mode, and Always-on-Top preferences across restarts.

---

## Download & Installation

Download the latest installer for your operating system from the [**Releases**](https://github.com/bentodvictor/restoro/releases) page:

| Platform | Formats |
| :--- | :--- |
| **Windows (x64)** | `Restoro_x.x.x_x64-setup.exe` (NSIS), `Restoro_x.x.x_x64_en-US.msi` (MSI) |
| **macOS (Apple Silicon & Intel)** | `Restoro_x.x.x_aarch64.dmg`, `Restoro_x.x.x_x64.dmg`, `.app` |
| **Linux (x64)** | `.deb`, `.rpm`, `.AppImage` |

---

## Tech Stack

- **Desktop Core**: [Tauri v2](https://v2.tauri.app/) (Rust)
- **Frontend**: React 18 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v4 + Lucide Icons
- **Audio**: Native Web Audio API synthesizer

---

## Building from Source

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Rust & Cargo](https://rustup.rs/) (stable toolchain)
- Platform build dependencies ([Tauri v2 Prerequisites](https://v2.tauri.app/start/prerequisites/)):
  - **Windows**: Visual Studio C++ Build Tools & WebView2
  - **Linux (Ubuntu/Debian)**: `sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`
  - **macOS**: Xcode Command Line Tools

### Commands

```bash
# Clone the repository
git clone https://github.com/bentodvictor/restoro.git
cd restoro

# Install frontend dependencies
npm install

# Run in browser preview mode
npm run dev

# Run Tauri desktop app in development mode
npm run tauri dev

# Build production desktop installers for current OS
npm run build:all

# Windows-only helper script (installs Rust if missing and builds .exe + .msi)
.\build-windows.ps1
```

---

## Project Structure

```text
restoro/
├── src/
│   ├── components/
│   │   ├── Titlebar.tsx         # Frameless drag region, Pin, Settings, Hide (-), Quit (×)
│   │   ├── StopwatchView.tsx    # Circular progress ring, readout, steppers, Start/Stop buttons
│   │   ├── SettingsDrawer.tsx   # Transition sound, Rest overlay, and Strict mode toggles
│   │   └── RestOverlayView.tsx  # Fullscreen dimmed break overlay
│   ├── hooks/
│   │   ├── useTimer.ts          # Drift-corrected countdown engine & multi-window state sync
│   │   └── useSettings.ts       # Persistent configuration (defaults: 45m / 15m / 8 cycles)
│   ├── utils/
│   │   ├── sound.ts             # Web Audio API synthesized chimes
│   │   └── tauri.ts             # Tauri v2 window, tray, and event bridge
│   ├── types/
│   │   └── timer.ts             # Shared TypeScript interfaces
│   ├── App.tsx                  # Main window & Overlay window routing
│   └── main.tsx
└── src-tauri/
    ├── src/
    │   ├── lib.rs               # System tray menu, event handlers, window lifecycle
    │   └── main.rs
    ├── capabilities/
    │   └── default.json         # Tauri v2 window & event permissions
    └── tauri.conf.json          # Window definitions (main + overlay) & bundle config
```

---

## License

Released under the [MIT License](LICENSE).
