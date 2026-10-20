import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { EASE, Logo, Mascot } from './ui'
import { SoundToggle } from './Waveform'
import { useStore, fmtDate } from '../store/Store'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/programs', label: 'Programs' },
  { to: '/events', label: 'Events' },
  { to: '/corporate', label: 'Corporate' },
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Team' },
  { to: '/journal', label: 'Journal' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const { pathname } = useLocation()
  const { scrollY } = useScroll()
  const { upcoming } = useStore()
  const next = upcoming[0]

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(v > prev && v > 240 && !open)
    setSolid(v > 40)
  })

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <motion.header
        className={`nav ${solid || pathname.startsWith('/journal/') ? 'nav--solid' : ''} ${pathname.startsWith('/journal/') ? 'nav--ink' : ''} ${open ? 'nav--open' : ''}`}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="nav__inner">
          <Link to="/" className="nav__logo" aria-label="Miyagi home">
            <Logo />
          </Link>
          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className="nav__link">
                <span className="nav__link-roll" data-text={l.label}>{l.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="nav__right">
            <SoundToggle className="hide-mobile" />
            <Link to="/contact" className="nav__cta hide-mobile" data-cursor="hide">
              <span>Let’s talk</span>
            </Link>
            <button className="nav__burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
              <span /><span />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu__inner">
              <ul className="menu__list">
                {[...LINKS, { to: '/contact', label: 'Contact' }].map((l, i) => (
                  <li key={l.to} className="menu__item">
                    <motion.div
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '110%' }}
                      transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
                    >
                      <NavLink to={l.to} end={l.to === '/'}>
                        <span className="num">0{i + 1}</span>
                        {l.label}
                      </NavLink>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <motion.div className="menu__foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }}>
                {next && (
                  <Link to={`/events/${next.id}`} className="menu__next">
                    <span className="label">Next on stage · {fmtDate(next.date, { day: 'numeric', month: 'short' })}</span>
                    <span>{next.title}</span>
                  </Link>
                )}
                <SoundToggle />
                <div className="menu__contact">
                  <a href="mailto:hello@miyagi.in">hello@miyagi.in</a>
                  <a href="tel:+919800000000">+91 98000 00000</a>
                </div>
              </motion.div>
              <Mascot className="menu__mascot" animated />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
