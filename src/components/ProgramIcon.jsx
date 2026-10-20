import { createElement } from 'react'
import { motion } from 'framer-motion'

/* Line icons for each discipline — 64 grid, stroke = currentColor.
   draw: false (static) | 'mount' (draws on mount) | 'view' (draws when scrolled into view) */
const SHAPES = {
  'public-speaking': [
    ['rect', { x: 25, y: 6, width: 14, height: 28, rx: 7 }],
    ['path', { d: 'M17 26a15 15 0 0 0 30 0' }],
    ['path', { d: 'M32 41v13M23 56h18' }],
    ['path', { d: 'M30 14h4M30 20h4' }],
  ],
  debating: [
    ['path', { d: 'M6 10h28v18H20l-7 7v-7H6z' }],
    ['path', { d: 'M30 32h28v18h-7v7l-7-7H30z' }],
    ['path', { d: 'M13 19h14M37 41h14' }],
  ],
  storytelling: [
    ['path', { d: 'M32 16C24 10 14 10 6 12v38c8-2 18-2 26 4 8-6 18-6 26-4V12c-8-2-18-2-26 4z' }],
    ['path', { d: 'M32 16v38' }],
    ['path', { d: 'M13 22c4-1 8-1 12 1M13 30c4-1 8-1 12 1M39 23c4-2 8-2 12-1' }],
  ],
  'creative-writing': [
    ['path', { d: 'M44 6l14 14-30 30-16 4 4-16z' }],
    ['path', { d: 'M38 12l14 14' }],
    ['path', { d: 'M16 38l10 10' }],
    ['path', { d: 'M8 58h22' }],
  ],
  'theatre-expression': [
    ['path', { d: 'M10 10h34v18c0 12-8 22-17 22S10 40 10 28z' }],
    ['circle', { cx: 20, cy: 24, r: 2.5 }],
    ['circle', { cx: 34, cy: 24, r: 2.5 }],
    ['path', { d: 'M20 35c4 5 10 5 14 0' }],
    ['path', { d: 'M44 22h10v16c0 10-6 18-13 18-4 0-7-2-10-5' }],
  ],
  'interview-mastery': [
    ['rect', { x: 8, y: 20, width: 48, height: 32, rx: 5 }],
    ['path', { d: 'M24 20v-7h16v7' }],
    ['path', { d: 'M8 34h48' }],
    ['path', { d: 'M29 34v6h6v-6' }],
  ],
  'leadership-presence': [
    ['path', { d: 'M32 6l7 14 15 2-11 10 3 15-14-7-14 7 3-15-11-10 15-2z' }],
    ['path', { d: 'M20 58h24' }],
  ],
  'mun-diplomacy': [
    ['circle', { cx: 32, cy: 32, r: 24 }],
    ['ellipse', { cx: 32, cy: 32, rx: 10, ry: 24 }],
    ['path', { d: 'M8 32h48M12 20h40M12 44h40' }],
  ],
}

export default function ProgramIcon({ slug, className = '', draw = false, delay = 0 }) {
  const shapes = SHAPES[slug] || SHAPES['public-speaking']
  return (
    <svg className={`picon ${className}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {shapes.map(([tag, props], i) => {
        if (!draw) return createElement(tag, { key: i, ...props })
        const M = motion[tag]
        const from = { pathLength: 0, opacity: 0 }
        const to = { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: delay + i * 0.14 }, opacity: { duration: 0.01, delay: delay + i * 0.14 } } }
        return draw === 'view' ? (
          <M key={i} {...props} initial={from} whileInView={to} viewport={{ once: true }} />
        ) : (
          <M key={i} {...props} initial={from} animate={to} />
        )
      })}
    </svg>
  )
}
