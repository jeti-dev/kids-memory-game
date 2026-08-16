let ctx: AudioContext | null = null

function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
  }
  return ctx
}

function tone(frequency: number, startTime: number, duration: number, gainPeak = 0.2) {
  const audioCtx = getContext()
  const oscillator = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  oscillator.connect(gain)
  gain.connect(audioCtx.destination)
  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

export function playMatch() {
  const audioCtx = getContext()
  const now = audioCtx.currentTime
  tone(523.25, now, 0.18)
  tone(659.25, now + 0.1, 0.22)
}

export function playMismatch() {
  const audioCtx = getContext()
  const now = audioCtx.currentTime
  tone(220, now, 0.25, 0.12)
}

export function playWin() {
  const audioCtx = getContext()
  const now = audioCtx.currentTime
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, i) => tone(freq, now + i * 0.15, 0.3))
}
