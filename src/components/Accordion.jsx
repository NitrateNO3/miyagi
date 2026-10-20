import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, Plus } from './ui'

export default function Accordion({ items, numbered = true, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="acc">
      {items.map((it, i) => (
        <div key={i} className={`acc__item ${open === i ? 'is-open' : ''}`}>
          <button className="acc__head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {numbered && <span className="num">{String(i + 1).padStart(2, '0')}</span>}
            <span>{it.t}</span>
            <span className="acc__icon"><Plus /></span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                className="acc__body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <p>{it.d}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
