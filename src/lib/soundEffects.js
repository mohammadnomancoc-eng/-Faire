/**
 * Lightweight Web Audio API synthesizer for task completion chimes
 */
class SoundEffects {
  constructor() {
    this.ctx = null
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (AudioContext) {
        this.ctx = new AudioContext()
      }
    }
  }

  playSuccessChime() {
    try {
      this.init()
      if (!this.ctx) return
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }

      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08)

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.3)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(this.ctx.currentTime + idx * 0.08)
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.3)
      })
    } catch (e) {
      // Audio playback failed silently
    }
  }
}

export const soundEffects = new SoundEffects()
