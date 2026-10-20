import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useMotionValue, useSpring } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]

/* ---------- Brand marks (vector redraw of the Miyagi mascot) ---------- */
export function Mascot({ className = '', animated = false, band = '#fff', ink = 'currentColor', ...rest }) {
  return (
    <svg className={`mascot ${animated ? 'mascot--live' : ''} ${className}`} viewBox="470 260 1010 1400" aria-hidden="true" {...rest}>
      <g className="mascot__head" fill={ink}>
        <path d="M684 436 C700 340 830 273 965 273 C1100 273 1225 340 1245 436 Z" />
        <path d="M681 720 H1248 V805 C1248 915 1120 997 965 997 C810 997 681 915 681 805 Z" />
      </g>
      <g className="mascot__band" fill={band}>
        <rect x="645" y="472" width="633" height="213" />
        <g className="mascot__ties">
          <path d="M1234 474 L1314 318 L1356 354 L1250 505 Z" />
          <path d="M1250 520 L1421 329 L1457 406 L1278 512 Z" />
        </g>
      </g>
      <g fill="none" stroke={ink} strokeLinecap="round">
        <path className="mascot__arc" d="M525 740 C525 990 720 1175 965 1175 C1210 1175 1405 990 1405 740" strokeWidth="105" />
        <path d="M820 1190 L670 1597" strokeWidth="95" />
        <path d="M1110 1190 L1260 1597" strokeWidth="95" />
      </g>
    </svg>
  )
}

export function Logo({ className = '', compact = false }) {
  return (
    <span className={`logo ${className}`}>
      <span className="logo__tile">
        <Mascot ink="#000" band="#fff" />
      </span>
      {!compact && (
        <span className="logo__type">
          <span className="logo__word">MIYAGI</span>
          <span className="logo__tag">The Communication Champ</span>
        </span>
      )}
    </span>
  )
}

export const Arrow = ({ dir = 'ur' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir === 'r' ? 'rotate(45deg)' : dir === 'd' ? 'rotate(135deg)' : dir === 'l' ? 'rotate(-135deg)' : undefined }}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
)

/* ---------- Magnetic wrapper ---------- */
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 })
  const move = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }
  return (
    <motion.span ref={ref} className={`magnetic ${className}`} style={{ x: sx, y: sy, display: 'inline-flex' }} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </motion.span>
  )
}

/* ---------- Button ---------- */
export function Btn({ to, href, children, variant = '', size = '', icon = true, className = '', magnetic = true, ...rest }) {
  const cls = `btn ${variant ? 'btn--' + variant : ''} ${size ? 'btn--' + size : ''} ${!icon ? 'btn--noicon' : ''} ${className}`
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="btn__icon"><Arrow /></span>
      )}
    </>
  )
  const el = to ? (
    <Link to={to} className={cls} data-cursor="hide" {...rest}>{inner}</Link>
  ) : href ? (
    <a href={href} className={cls} data-cursor="hide" {...rest}>{inner}</a>
  ) : (
    <button className={cls} data-cursor="hide" {...rest}>{inner}</button>
  )
  return magnetic ? <Magnetic strength={0.2}>{el}</Magnetic> : el
}

/* ---------- Text reveals ---------- */
export function SplitText({ children, as: Tag = 'h2', className = '', delay = 0, stagger = 0.06, once = true, immediate = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '0px 0px -12% 0px' })
  const show = immediate || inView
  const lines = Array.isArray(children) ? children : [children]
  let i = 0
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, li) => (
        <span className="split-line" key={li}>
          {(typeof line === 'string' ? line.split(' ') : [line]).map((w, wi, arr) => {
            const idx = i++
            return (
              <motion.span
                key={wi}
                className="split-word"
                initial={{ y: '115%', rotate: 4 }}
                animate={show ? { y: '0%', rotate: 0 } : {}}
                transition={{ duration: 1.1, ease: EASE, delay: delay + idx * stagger }}
              >
                {w}
                {typeof w === 'string' && wi < arr.length - 1 ? ' ' : ''}
              </motion.span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

export function Reveal({ children, delay = 0, y = 40, className = '', as = 'div', ...rest }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  )
}

/* ---------- Count-up ---------- */
export function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, value, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value])
  return (
    <span ref={ref}>
      {n.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

/* ---------- Marquee ---------- */
export function Marquee({ items, className = '', speed = 40, reverse = false }) {
  const row = (
    <div className="marquee__row" aria-hidden>
      {items.map((t, i) => (
        <span className="marquee__item" key={i}>
          {t}
          <Star />
        </span>
      ))}
    </div>
  )
  return (
    <div className={`marquee ${className}`} style={{ '--speed': speed + 's', '--dir': reverse ? 'reverse' : 'normal' }}>
      <div className="marquee__track">{row}{row}</div>
    </div>
  )
}

export const Star = () => (
  <svg className="star" viewBox="0 0 40 40" aria-hidden>
    <path d="M20 0c1.6 10.6 8.4 18.4 20 20-11.6 1.6-18.4 9.4-20 20C18.4 29.4 11.6 21.6 0 20 11.6 18.4 18.4 10.6 20 0Z" fill="currentColor" />
  </svg>
)

export function SectionHead({ index, eyebrow, title, children, className = '' }) {
  return (
    <div className={`section-head ${className}`}>
      <div className="section-head__meta">
        {index && <span className="num">({index})</span>}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      </div>
      <SplitText className="h2">{title}</SplitText>
      {children && <Reveal className="section-head__aside" delay={0.2}>{children}</Reveal>}
    </div>
  )
}

/* ---------- Rotating circular badge (inner page heroes) ---------- */
export function RotBadge({ text, className = '' }) {
  const id = 'rb-' + text.length
  return (
    <motion.div
      className={`rotbadge ${className}`}
      initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.4, ease: EASE, delay: 1 }}
      aria-hidden
    >
      <svg viewBox="0 0 200 200" className="rotbadge__ring">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="486">{text}</textPath>
        </text>
      </svg>
      <span className="rotbadge__core">
        <Mascot animated ink="#000" band="#fff" />
      </span>
    </motion.div>
  )
}
