import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useLocation } from 'react-router-dom'

/* Desktop-only cursor: small amber dot that grows into a labelled disc on [data-cursor] targets. */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState({ mode: 'default', label: '' })
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const { pathname } = useLocation()

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setEnabled(mq.matches)
    const on = () => setEnabled(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => setState({ mode: 'default', label: '' }), [pathname])

  useEffect(() => {
    if (!enabled) return
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const t = e.target.closest('[data-cursor], a, button, input, textarea, select, label')
      if (!t) return setState({ mode: 'default', label: '' })
      const c = t.getAttribute('data-cursor')
      if (c === 'hide') return setState({ mode: 'hide', label: '' })
      if (c) return setState({ mode: 'label', label: c })
      if (/INPUT|TEXTAREA|SELECT/.test(t.tagName)) return setState({ mode: 'hide', label: '' })
      setState({ mode: 'link', label: '' })
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const size = state.mode === 'label' ? 96 : state.mode === 'link' ? 44 : state.mode === 'hide' ? 0 : 12
  return (
    <motion.div className={`cursor cursor--${state.mode}`} style={{ x: sx, y: sy }} aria-hidden>
      <motion.div className="cursor__dot" animate={{ width: size, height: size }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}>
        {state.mode === 'label' && <span>{state.label}</span>}
      </motion.div>
    </motion.div>
  )
}
