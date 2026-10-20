import { useEffect, useRef } from 'react'
import { useAudio } from '../store/Audio'

/* Bars react to the soundtrack when it plays; otherwise they breathe gently. */
export default function Waveform({ bars = 64, className = '', idle = 0.32 }) {
  const ref = useRef(null)
  const { analyser, playing } = useAudio()

  useEffect(() => {
    const els = ref.current ? [...ref.current.children] : []
    const data = new Uint8Array(64)
    let raf
    const start = performance.now()
    const loop = (t) => {
      const time = (t - start) / 1000
      const an = analyser.current
      if (playing && an) an.getByteFrequencyData(data)
      els.forEach((el, i) => {
        const center = 1 - Math.abs(i - bars / 2) / (bars / 2)
        let v
        if (playing && an) {
          const bin = data[Math.floor((Math.abs(i - bars / 2) / (bars / 2)) * 40)] / 255
          v = 0.06 + bin * (0.45 + center * 0.6)
        } else {
          v = 0.05 + idle * center * (0.55 + 0.45 * Math.sin(time * 1.6 + i * 0.32)) * (0.7 + 0.3 * Math.sin(time * 0.7 + i * 0.11))
        }
        el.style.transform = `scaleY(${Math.min(1, v).toFixed(3)})`
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [analyser, playing, bars, idle])

  return (
    <div ref={ref} className={`wave ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => <span key={i} />)}
    </div>
  )
}

export function SoundToggle({ className = '' }) {
  const { playing, missing, toggle } = useAudio()
  return (
    <button
      className={`sound ${playing ? 'is-on' : ''} ${className}`}
      onClick={toggle}
      aria-pressed={playing}
      title={missing ? 'Add /public/audio/miyagi-theme.mp3 to enable sound' : playing ? 'Mute soundtrack' : 'Play soundtrack'}
      data-cursor="hide"
    >
      <span className="sound__bars" aria-hidden>
        <i /><i /><i /><i />
      </span>
      <span className="sound__label">{missing ? 'No track' : playing ? 'Sound on' : 'Sound off'}</span>
    </button>
  )
}
