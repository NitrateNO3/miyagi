import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { Mascot } from './ui'

const WORDS = ['Breathe.', 'Stand tall.', 'Speak.']

export default function Preloader() {
  const [done, setDone] = useState(false)
  const [n, setN] = useState(0)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    const c = animate(0, 100, {
      duration: 2.1,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => setTimeout(() => setDone(true), 250),
    })
    return () => c.stop()
  }, [])

  useEffect(() => {
    if (done) document.documentElement.style.overflow = ''
  }, [done])

  const word = WORDS[Math.min(WORDS.length - 1, Math.floor(n / 34))]

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="preloader__center">
            <Mascot className="preloader__mascot" animated ink="#000" band="#fff" />
            <div className="preloader__word">
              <AnimatePresence mode="wait">
                <motion.span
                  key={word}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <div className="preloader__foot">
            <span className="label">Miyagi · The Communication Champ</span>
            <span className="preloader__count">{String(n).padStart(3, '0')}</span>
          </div>
          <div className="preloader__bar" style={{ transform: `scaleX(${n / 100})` }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
