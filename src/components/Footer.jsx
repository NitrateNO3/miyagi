import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Arrow, Btn, Logo, Mascot, Reveal, SplitText } from './ui'
import { lenis } from './SmoothScroll'

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 10v6M8 7.5v.01M12 16v-6M12 13c0-2 4-2.5 4 0v3" />
      </>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/919800000000',
    icon: (
      <>
        <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
        <path d="M9 9.5c.5 2 2 3.5 4 4.5l1.3-1.2 2 .9c-.3 1.3-1.4 2-2.6 1.8-3.3-.6-5.6-3-6.2-6.2C7.3 8 8 7 9.3 6.7l.9 2z" fill="currentColor" stroke="none" />
      </>
    ),
  },
]

export default function Footer({ cta = true }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const wipe = useTransform(scrollYProgress, [0.45, 1], ['-100%', '0%'])
  const wipeIn = useTransform(scrollYProgress, [0.45, 1], ['100%', '0%'])
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))

  return (
    <footer className="ft t-dark" ref={ref}>
      {cta && (
        <div className="container">
          <Reveal className="yt">
            <div className="yt__copy">
              <span className="yt__eyebrow">Your turn</span>
              <SplitText as="h2" className="yt__title">{['Your turn', <span key="o" className="italic">on stage.</span>]}</SplitText>
              <p className="yt__lede">Start with a free 30-minute trial class. No scripts and no pressure. Just a mic, a coach and your first step.</p>
              <ol className="yt__steps">
                {['Book a free trial', 'Meet your coach', 'Take the stage'].map((s, k) => (
                  <li key={s}>
                    <span>{k + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="yt__ctas">
                <Btn to="/contact" variant="black">Book a free trial</Btn>
                <a href="https://wa.me/919800000000" className="yt__wa link-u" target="_blank" rel="noreferrer">or WhatsApp us</a>
              </div>
            </div>
            <div className="yt__art" aria-hidden>
              <span className="yt__ring" />
              <span className="yt__ring" />
              <span className="yt__ring" />
              <div className="yt__mascot">
                <Mascot animated ink="#000" band="#fbb03b" />
              </div>
              <span className="yt__bubble yt__bubble--1">“Hello, everyone!”</span>
              <span className="yt__bubble yt__bubble--2">👏 👏 👏</span>
            </div>
          </Reveal>
        </div>
      )}

      <div className="container ft__top">
        <Link to="/" className="ft__logo" aria-label="Miyagi home"><Logo /></Link>
        <p className="ft__promise">Helping children, students and teams find their voice since 2016.</p>
        <div className="ft__socials">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="ft__social" data-cursor="hide">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
            </a>
          ))}
        </div>
      </div>

      <div className="container ft__grid">
        <div className="ft__col">
          <span className="ft__h">Learn</span>
          <Link className="link-u" to="/programs?for=schools">For schools</Link>
          <Link className="link-u" to="/programs?for=colleges">For colleges</Link>
          <Link className="link-u" to="/programs?for=individuals">For individuals</Link>
          <Link className="link-u" to="/corporate">For teams</Link>
        </div>
        <div className="ft__col">
          <span className="ft__h">Miyagi</span>
          <Link className="link-u" to="/about">About us</Link>
          <Link className="link-u" to="/team">Our coaches</Link>
          <Link className="link-u" to="/events">Events</Link>
          <Link className="link-u" to="/journal">Journal</Link>
        </div>
        <div className="ft__col">
          <span className="ft__h">Visit us</span>
          <span>Miyagi Studio, Sector 29<br />Gurugram 122002</span>
          <span className="ft__muted">Tue – Sun · 10am – 7pm</span>
          <a className="link-u" href="mailto:hello@miyagi.in">hello@miyagi.in</a>
          <a className="link-u" href="tel:+919800000000">+91 98000 00000</a>
        </div>
        <div className="ft__news">
          <span className="ft__h">The Miyagi Letter</span>
          <p>One practical speaking tip a month. Loved by 9,000+ parents & leaders.</p>
          {done ? (
            <p className="ft__thanks">You’re in. Wax on!</p>
          ) : (
            <form
              className="ft__form"
              onSubmit={(e) => {
                e.preventDefault()
                if (email.includes('@')) setDone(true)
              }}
            >
              <input type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
              <button aria-label="Subscribe" data-cursor="hide">Subscribe <Arrow dir="r" /></button>
            </form>
          )}
        </div>
      </div>

      <div className="ft__brand" aria-hidden>
        <div className="ft__word ft__word--outline">MIYAGI</div>
        <motion.div className="ft__word-clip" style={{ x: wipe }}>
          <motion.div className="ft__word ft__word--fill" style={{ x: wipeIn }}>MIYAGI</motion.div>
        </motion.div>
      </div>

      <div className="container ft__base">
        <span>© {new Date().getFullYear()} Miyagi, The Communication Champ</span>
        <div className="ft__base-links">
          <Link to="/admin" className="link-u">Team login</Link>
          <Link to="/contact" className="link-u">Privacy</Link>
          <button className="ft__top-btn" onClick={toTop} data-cursor="hide">
            Back to top <span><Arrow /></span>
          </button>
        </div>
      </div>
    </footer>
  )
}
