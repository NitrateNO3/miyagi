import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '../components/Page'
import EventPoster from '../components/EventPoster'
import { Arrow, Btn, EASE, Mascot, Reveal, SplitText, Star } from '../components/ui'
import { fmtDate, fmtPrice, isPast, useStore } from '../store/Store'
import { lenis } from '../components/SmoothScroll'

const RZP_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID

const loadRazorpay = () =>
  new Promise((res) => {
    if (window.Razorpay) return res(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => res(true)
    s.onerror = () => res(false)
    document.body.appendChild(s)
  })

export default function EventDetail() {
  const { id } = useParams()
  const { events, seatsLeft } = useStore()
  const e = events.find((x) => x.id === id)
  const [open, setOpen] = useState(false)
  if (!e) return <Navigate to="/events" replace />
  const past = isPast(e)
  const left = seatsLeft(e)
  const d = new Date(e.date + 'T' + (e.time || '10:00'))

  return (
    <Page title={e.title} cta={false}>
      <section className="ed t-dark">
        <div className="grain" />
        <div className="container ed__grid">
          <div className="ed__poster-col">
            <motion.div className="ed__poster" initial={{ opacity: 0, y: 60, rotate: -3 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ duration: 1.3, ease: EASE, delay: 0.8 }}>
              <EventPoster event={e} past={past} />
            </motion.div>
          </div>
          <div className="ed__info">
            <Link to="/events" className="pd-back link-u"><Arrow dir="l" /> All events</Link>
            <span className="label amber ed__kicker">{e.kicker}</span>
            <SplitText as="h1" className="h1" immediate delay={0.75}>{e.title}</SplitText>
            {!past && <Countdown target={d} />}
            <Reveal delay={1} className="ed__facts">
              {[
                ['Date', fmtDate(e.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
                ['Time', e.time],
                ['Venue', e.venue],
                ['Ticket', fmtPrice(e.price) + (e.price ? ' per seat' : '')],
              ].map(([k, v]) => (
                <div key={k} className="ed__fact">
                  <span className="label mute">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </Reveal>
            <Reveal delay={1.1}>
              <p className="ed__desc">{e.description}</p>
            </Reveal>
            {e.agenda?.length > 0 && (
              <Reveal delay={1.15} className="ed__agenda">
                <span className="label mute">Running order</span>
                <ul>
                  {e.agenda.map((a) => (
                    <li key={a}><Star /> {a}</li>
                  ))}
                </ul>
              </Reveal>
            )}
            <Reveal delay={1.2} className="ed__book">
              {past ? (
                <div className="ed__ended">
                  <span className="chip">Concluded</span>
                  <p className="mute">This event has wrapped. See what’s coming up next.</p>
                  <Btn to="/events" variant="ghost" icon={false}>Upcoming events</Btn>
                </div>
              ) : (
                <>
                  <div className="ed__seats">
                    <div className="ed__seat-bar"><span style={{ width: `${(1 - left / e.seats) * 100}%` }} /></div>
                    <span className="mute">{left} of {e.seats} seats left</span>
                  </div>
                  <Btn variant="amber" onClick={() => setOpen(true)} disabled={left === 0} magnetic={false} className="btn--block">
                    {left === 0 ? 'Sold out' : `Book your seat · ${fmtPrice(e.price)}`}
                  </Btn>
                </>
              )}
            </Reveal>
          </div>
        </div>
      </section>
      <AnimatePresence>{open && <Checkout event={e} left={left} onClose={() => setOpen(false)} />}</AnimatePresence>
    </Page>
  )
}

function Countdown({ target }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, target - now)
  const parts = [
    ['Days', Math.floor(diff / 864e5)],
    ['Hrs', Math.floor(diff / 36e5) % 24],
    ['Min', Math.floor(diff / 6e4) % 60],
    ['Sec', Math.floor(diff / 1e3) % 60],
  ]
  return (
    <Reveal delay={0.95} className="countdown">
      {parts.map(([l, v]) => (
        <div key={l}>
          <span className="countdown__v">{String(v).padStart(2, '0')}</span>
          <span className="label mute">{l}</span>
        </div>
      ))}
    </Reveal>
  )
}

function Checkout({ event, left, onClose }) {
  const { addRegistration } = useStore()
  const [step, setStep] = useState('form') // form | paying | done | error
  const [qty, setQty] = useState(1)
  const [f, setF] = useState({ name: '', email: '', phone: '', attendee: '' })
  const [ref, setRef] = useState('')
  const total = qty * event.price
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  useEffect(() => {
    lenis?.stop()
    const esc = (e) => e.key === 'Escape' && step !== 'paying' && onClose()
    window.addEventListener('keydown', esc)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', esc)
    }
  }, [onClose, step])

  const record = (paymentId) => {
    const id = 'MYG-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    addRegistration({ id, eventId: event.id, eventTitle: event.title, qty, amount: total, ...f, paymentId, createdAt: new Date().toISOString() })
    setRef(id)
    setStep('done')
  }

  const pay = async (e) => {
    e.preventDefault()
    setStep('paying')
    if (total === 0) return setTimeout(() => record('free'), 700)
    if (RZP_KEY && (await loadRazorpay())) {
      const rzp = new window.Razorpay({
        key: RZP_KEY,
        amount: total * 100,
        currency: 'INR',
        name: 'Miyagi',
        description: `${event.title} × ${qty}`,
        prefill: { name: f.name, email: f.email, contact: f.phone },
        theme: { color: '#fbb03b' },
        handler: (r) => record(r.razorpay_payment_id),
        modal: { ondismiss: () => setStep('form') },
      })
      rzp.on('payment.failed', () => setStep('error'))
      rzp.open()
    } else {
      setTimeout(() => record('demo_' + Date.now()), 1600)
    }
  }

  return (
    <motion.div className="co" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <div className="co__scrim" onClick={() => step !== 'paying' && onClose()} />
      <motion.aside
        className="co__panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label="Book your seat"
      >
        <div className="co__head">
          <span className="label">Checkout</span>
          <button className="co__close" onClick={onClose} aria-label="Close" disabled={step === 'paying'}>✕</button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'done' ? (
            <motion.div key="done" className="co__done" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              <div className="co__ticket">
                <Mascot animated ink="#000" band="#fff" />
                <span className="label">Booking confirmed</span>
                <h3>You’re on the list.</h3>
                <div className="co__ticket-rows">
                  <span>{event.title}</span>
                  <span>{fmtDate(event.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {event.time}</span>
                  <span>{qty} seat{qty > 1 ? 's' : ''} · {fmtPrice(total)}</span>
                </div>
                <div className="co__ticket-ref">
                  <span className="label">Ref</span>
                  <strong>{ref}</strong>
                </div>
              </div>
              <p className="mute">A confirmation email with your e-ticket is on its way to <strong>{f.email}</strong>.</p>
              <Btn variant="ghost" icon={false} onClick={onClose} magnetic={false}>Done</Btn>
            </motion.div>
          ) : (
            <motion.form key="form" className="co__form" onSubmit={pay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
              <div className="co__event">
                <div className="co__thumb"><EventPoster event={event} /></div>
                <div>
                  <h3>{event.title}</h3>
                  <span className="mute">{fmtDate(event.date, { day: 'numeric', month: 'long' })} · {event.venue}</span>
                </div>
              </div>

              <div className="co__qty">
                <span className="label mute">Seats</span>
                <div className="stepper">
                  <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Fewer">−</button>
                  <span>{qty}</span>
                  <button type="button" onClick={() => setQty(Math.min(Math.min(10, left), qty + 1))} aria-label="More">+</button>
                </div>
              </div>

              <div className="co__fields">
                <div className="field"><label htmlFor="cn">Booked by</label><input id="cn" required value={f.name} onChange={set('name')} placeholder="Parent / guardian name" /></div>
                <div className="field"><label htmlFor="ca">Participant name(s)</label><input id="ca" value={f.attendee} onChange={set('attendee')} placeholder="Who’s attending" /></div>
                <div className="field"><label htmlFor="ce">Email</label><input id="ce" required type="email" value={f.email} onChange={set('email')} placeholder="For your e-ticket" /></div>
                <div className="field"><label htmlFor="cp">Phone</label><input id="cp" required type="tel" pattern="[0-9+ ]{10,15}" value={f.phone} onChange={set('phone')} placeholder="+91" /></div>
              </div>

              <div className="co__total">
                <div className="co__line"><span>{fmtPrice(event.price)} × {qty}</span><span>{fmtPrice(total)}</span></div>
                <div className="co__line co__line--total"><span>Total</span><span>{fmtPrice(total)}</span></div>
              </div>

              {step === 'error' && <p className="co__err">Payment didn’t go through. No money was taken, please try again.</p>}

              <button className="co__pay" disabled={step === 'paying'} data-cursor="hide">
                {step === 'paying' ? (
                  <span className="co__spinner" />
                ) : (
                  <>
                    <span>{total === 0 ? 'Reserve free seat' : `Pay ${fmtPrice(total)}`}</span>
                    <Arrow dir="r" />
                  </>
                )}
              </button>
              <p className="co__secure">
                🔒 Secured by Razorpay · UPI, cards & netbanking
                {!RZP_KEY && <em> · demo mode</em>}
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.aside>
    </motion.div>
  )
}
