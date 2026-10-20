import { createContext, useCallback, useContext, useRef, useState } from 'react'

const SRC = '/audio/miyagi-theme.mp3'
const AudioCtx = createContext(null)

export function AudioProvider({ children }) {
  const audio = useRef(null)
  const ctx = useRef(null)
  const analyser = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [missing, setMissing] = useState(false)

  const setup = () => {
    if (audio.current) return
    const a = new Audio(SRC)
    a.loop = true
    a.volume = 0.55
    a.preload = 'auto'
    a.addEventListener('error', () => { setMissing(true); setPlaying(false) })
    audio.current = a
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      const c = new AC()
      const src = c.createMediaElementSource(a)
      const an = c.createAnalyser()
      an.fftSize = 128
      an.smoothingTimeConstant = 0.82
      src.connect(an)
      an.connect(c.destination)
      ctx.current = c
      analyser.current = an
    } catch {}
  }

  const toggle = useCallback(async () => {
    setup()
    const a = audio.current
    if (!a.paused) {
      a.pause()
      setPlaying(false)
      return
    }
    try {
      await ctx.current?.resume()
      await a.play()
      setPlaying(true)
      setMissing(false)
    } catch {
      setMissing(true)
      setPlaying(false)
    }
  }, [])

  return (
    <AudioCtx.Provider value={{ playing, missing, toggle, analyser }}>{children}</AudioCtx.Provider>
  )
}

export const useAudio = () => useContext(AudioCtx)
