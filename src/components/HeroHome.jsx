import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { Arrow, Btn, EASE, Mascot } from './ui'
import { fmtDate, useStore } from '../store/Store'
import { introDelay } from '../hooks/useMedia'

/*
  Home hero. Everything animates with transform / opacity only (plus one-off
  clip-path reveals), so it stays smooth on low-end phones.
*/

const WORDS = ['voice.', 'courage.', 'words.', 'stage.', 'spark.']
const WIPE = (delay, dur = 1.1) => ({
  initial: { clipPath: 'inset(0% 100% 0% 0%)', x: -24 },
  animate: { clipPath: 'inset(0% 0% 0% 0%)', x: 0 },
  transition: { duration: dur, ease: [0.76, 0, 0.24, 1], delay },
})

export default function HeroHome() {
  const ref = useRef(null)
  const d = useMemo(introDelay, [])
  const { upcoming } = useStore()
  const next = upcoming[0]

  // gentle mouse parallax (desktop only)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const layer = (k) => ({ x: useTransform(sx, (v) => v * k), y: useTransform(sy, (v) => v * k) })
  const l1 = layer(10)
  const l2 = layer(24)
  const l3 = layer(38)
  const onMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  // scroll: visual drifts up slower than the copy
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const visY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="hh" onMouseMove={onMove}>
      <div className="hh__glow" aria-hidden />

      <div className="hh__inner container">
        <motion.div className="hh__copy" style={{ y: copyY, opacity: fade }}>
          <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d, duration: 0.8 }}>
            Communication academy · Est. 2016
          </motion.span>

          <h1 className="hh__title" aria-label="Find your voice.">
            <motion.span className="hh__line" {...WIPE(d + 0.05)}>Find your</motion.span>
            <motion.span className="hh__line" {...WIPE(d + 0.2)}>
              <Rotator start={d + 1.6} />
            </motion.span>
          </h1>

          <motion.p className="hh__lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d + 0.55, duration: 0.9, ease: EASE }}>
            Public speaking, debate and storytelling for children, students and teams — coached in small batches and finished on a real stage.
          </motion.p>

          <motion.div className="hh__ctas" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d + 0.65, duration: 0.9, ease: EASE }}>
            <Btn to="/programs" variant="amber">Explore programs</Btn>
            <Btn to="/contact" variant="ghost" icon={false}>Free trial class</Btn>
          </motion.div>

          <motion.div className="hh__proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 0.85, duration: 0.9 }}>
            <div className="hh__faces" aria-hidden>
              <span style={{ background: '#fbb03b' }}>A</span>
              <span style={{ background: '#fde3b0' }}>M</span>
              <span style={{ background: '#e0731a' }}>K</span>
              <span className="hh__face-img"><img src="/assets/kid-crop.jpg" alt="" /></span>
            </div>
            <div className="hh__proof-text">
              <strong>12,000+ voices coached</strong>
              <span><b>★★★★★</b> 4.9 from 2,300 parents</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="hh__visual" style={{ y: visY }}>
          <div className="hh__ripples" aria-hidden>
            <span /><span /><span />
          </div>

          <motion.div className="hh__card" style={l1}>
            <motion.div
              className="hh__card-clip"
              initial={{ clipPath: 'inset(100% 0% 0% 0% round 28px)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: d + 0.1 }}
            >
              <motion.img
                src="/assets/kid-crop.jpg"
                alt="Aarav, 9, celebrating after his first speech"
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.8, ease: EASE, delay: d + 0.1 }}
              />
              <div className="hh__card-cap">
                <span className="hh__live"><i /> Now on stage</span>
                <strong>Aarav, 9</strong>
                <span>Public Speaking · Batch 14</span>
              </div>
            </motion.div>
          </motion.div>

          <Chip className="hh__chip--meter" style={l2} delay={d + 0.9} rotate={-4}>
            <Meter start={d + 1.2} />
          </Chip>

          <Chip className="hh__chip--weeks" style={l3} delay={d + 1.05} rotate={5}>
            <span className="label">Week 1</span>
            <span className="hh__weeks-arrow"><Arrow dir="r" /></span>
            <span className="label">Week 12</span>
            <p>Hid behind the curtain → hosted the school assembly.</p>
          </Chip>

          <Chip className="hh__chip--mascot" style={l3} delay={d + 1.2} rotate={-10}>
            <Mascot animated ink="#000" band="#fff" />
          </Chip>
        </motion.div>
      </div>

      <motion.div className="hh__foot container" style={{ opacity: fade }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d + 1, duration: 1 }}>
        <div className="hh__aud">
          {[
            ['Schools', '/programs?for=schools'],
            ['Colleges', '/programs?for=colleges'],
            ['Individuals', '/programs?for=individuals'],
            ['Teams', '/corporate'],
          ].map(([l, to]) => (
            <Link key={l} to={to} className="hh__aud-link">{l}</Link>
          ))}
        </div>
        {next && (
          <Link to={`/events/${next.id}`} className="hh__next">
            <span className="label mute">Next on stage · {fmtDate(next.date, { day: 'numeric', month: 'short' })}</span>
            <span className="hh__next-title">{next.title} <Arrow /></span>
          </Link>
        )}
      </motion.div>
    </section>
  )
}

function Chip({ children, className, style, delay, rotate }) {
  return (
    <motion.div className={`hh__chip ${className}`} style={style}>
      <div className="hh__float">
        <motion.div
          className="hh__chip-in"
          initial={{ opacity: 0, scale: 0.6, rotate: rotate * 3 }}
          animate={{ opacity: 1, scale: 1, rotate }}
          transition={{ type: 'spring', stiffness: 160, damping: 16, delay }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}

function Meter({ start }) {
  const v = useMotionValue(0)
  const [n, setN] = useState(0)
  useEffect(() => {
    const c = animate(v, 92, { duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: start, onUpdate: (x) => setN(Math.round(x)) })
    return () => c.stop()
  }, [v, start])
  const scale = useTransform(v, [0, 100], [0, 1])
  return (
    <>
      <div className="hh__meter-top">
        <span className="label">Confidence</span>
        <strong>{n}%</strong>
      </div>
      <div className="hh__meter-bar"><motion.span style={{ scaleX: scale }} /></div>
      <div className="hh__meter-ticks">
        <span>Eye contact</span><span>Pace</span><span>Pause</span>
      </div>
    </>
  )
}

/* Rotating word on an amber label. All words share one grid cell, so the
   box keeps the width of the longest word and nothing reflows. */
function Rotator({ start }) {
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState(-1)
  useEffect(() => {
    let iv
    const t = setTimeout(() => {
      iv = setInterval(() => {
        setI((c) => {
          setPrev(c)
          return (c + 1) % WORDS.length
        })
      }, 2200)
    }, start * 1000)
    return () => {
      clearTimeout(t)
      clearInterval(iv)
    }
  }, [start])
  const words = useRef([])
  const [widths, setWidths] = useState([])
  useEffect(() => {
    const measure = () => setWidths(words.current.map((el) => el?.offsetWidth || 0))
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  return (
    <motion.span className="rot" animate={widths[i] ? { width: widths[i] } : undefined} transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}>
      {WORDS.map((w, k) => {
        const state = k === i ? 'in' : k === prev ? 'out' : 'wait'
        return (
          <motion.span
            key={w}
            className="rot__w"
            aria-hidden={k !== i}
            initial={false}
            animate={{ y: state === 'in' ? '0%' : state === 'out' ? '-115%' : '115%', rotateX: state === 'in' ? 0 : state === 'out' ? 50 : -50 }}
            transition={state === 'wait' ? { duration: 0 } : { duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <span ref={(el) => (words.current[k] = el)} className="rot__m">{w}</span>
          </motion.span>
        )
      })}
    </motion.span>
  )
}
