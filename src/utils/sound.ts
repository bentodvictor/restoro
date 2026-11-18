export type ChimeType = "work" | "rest" | "complete";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      audioCtx = new Ctx();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  type: OscillatorType = "sine",
  peakGain = 0.18
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const startTime = ctx.currentTime + startOffset;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export function playChime(type: ChimeType, enabled: boolean): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (type === "work") {
    // Crisp ascending two-note chime (C5 -> G5)
    playTone(ctx, 523.25, 0, 0.22, "triangle", 0.2);
    playTone(ctx, 783.99, 0.14, 0.35, "triangle", 0.22);
  } else if (type === "rest") {
    // Calm descending warm chime (E5 -> A4)
    playTone(ctx, 659.25, 0, 0.3, "sine", 0.18);
    playTone(ctx, 440.0, 0.2, 0.55, "sine", 0.2);
  } else if (type === "complete") {
    // Triumphant 3-note resolution chord arpeggio (C5 -> E5 -> G5 -> C6)
    playTone(ctx, 523.25, 0, 0.22, "triangle", 0.18);
    playTone(ctx, 659.25, 0.13, 0.24, "triangle", 0.18);
    playTone(ctx, 783.99, 0.26, 0.28, "triangle", 0.2);
    playTone(ctx, 1046.5, 0.4, 0.6, "sine", 0.24);
  }
}
