# Restoro

Minimal desktop Pomodoro stopwatch built with **Tauri v2**, **React**, **TypeScript**, and **Tailwind CSS**.

## Features

- **Minimal Stopwatch UI**: Configure **Work (min)**, **Rest (min)**, and **Cycles (Iterations)** (defaults to `45m` Work + `15m` Rest × `8` Cycles = `8 hours`).
- **Two-Button Control**: Strictly **Play/Pause** and **Stop/Reset**. Inputs lock while a session is active.
- **Continuous Cycle Progression**: Automatically transitions between Work and Rest until all iterations complete.
- **Configurable Alerts & Rest Overlay**:
  - **Transition Sound**: Synthesized Web Audio API chimes for Work start, Rest start, and session completion.
  - **Rest Screen Overlay**: Dimmed fullscreen break overlay showing the Rest countdown and iteration counter.
  - **Strict Rest Mode**: Hides the Dismiss button on the Rest overlay until the Rest period finishes.
- **Frameless Window & System Tray**:
  - Pin Always-on-Top toggle (`Pin` icon)
  - Minimize (`-`) hides to System Tray; Close (`×`) quits
  - System Tray left-click toggles window; right-click menu provides `Show/Hide`, `Play/Pause`, `Stop/Reset`, and `Quit`

## Development

```bash
# Install dependencies
npm install

# Run frontend in browser preview mode
npm run dev

# Run full Tauri desktop app (requires Rust / Cargo installed)
npm run tauri dev

# Build production desktop bundle
npm run tauri build
```
