import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import Page from '../components/Page'
import EventPoster from '../components/EventPoster'
import { Arrow, EASE, Reveal, SplitText } from '../components/ui'
import { fmtDate, fmtPrice, useStore } from '../store/Store'
import { FlipCountdown } from './Home'

export default function Events() {
  const { upcoming, past, seatsLeft } = useStore()
  const [tab, setTab] = useState('upcoming')
  const next = upcoming[0]
  const seatsTotal = upcoming.reduce((n, e) => n + seatsLeft(e), 0)

  const TABS = [
    ['upcoming', 'Upcoming', 'Book now', upcoming.length],
    ['past', 'Past events', 'Galleries', past.length],
  ]

  return (
    <Page title="Events">
      {/* ---------------- Hero */}
      <section className="ev-hero t-dark">
        <div className="ev-hero__glow" aria-hidden />
        <div className="container ev-hero__grid">
          <div className="ev-hero__copy">
            <div className="page-hero__index">
              <span className="num">(E)</span>
              <span className="eyebrow">Events · Championships · Showcases</span>
            </div>
            <SplitText as="h1" className="ev-hero__title" immediate delay={0.75}>
              {['Lights.', <span key="m" className="italic amber">Mic.</span>, 'Action.']}
            </SplitText>
            <Reveal delay={1}>
              <p className="ev-hero__lede">Open championships, storytelling nights and bootcamps. Pick an event, book your seat and pay securely in under a minute.</p>
            </Reveal>
            <Reveal delay={1.1} className="ev-hero__stats">
              <span><strong>{upcoming.length}</strong> upcoming events</span>
              <span><strong>{seatsTotal}</strong> seats open</span>
              <span><strong>{past.length}+</strong> stages so far</span>
            </Reveal>
          </div>

          {next && (
            <Reveal delay={0.9}>
              <Link to={`/events/${next.id}`} className="tk ev-hero__tk" data-cursor="Book">
                <div className="tk__stub">
                  <div className="tk__poster"><EventPoster event={next} /></div>
                </div>
                <div className="tk__main">
                  <div className="tk__info">
                    <span className="tk__kicker">Next on stage · {next.kicker}</span>
                    <h3 className="tk__title">{next.title}</h3>
                    <div className="tk__facts">
                      <span><em>Date</em>{fmtDate(next.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <span><em>Time</em>{next.time}</span>
                      <span><em>Ticket</em>{fmtPrice(next.price)}</span>
                    </div>
                    <span className="tk__venue">{next.venue}</span>
                  </div>
                  <FlipCountdown target={new Date(next.date + 'T' + (next.time || '10:00'))} />
                  <div className="tk__foot">
                    <span className="tk__btn">Book your seat <Arrow /></span>
                  </div>
                  <span className="tk__admit" aria-hidden>Admit one · Miyagi · Admit one</span>
                  <span className="tk__code" aria-hidden />
                </div>
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------------- Tabs + lists */}
      <section className="ev t-dark">
        <div className="container">
          <div className="pf">
            <span className="pf__label">Show</span>
            <LayoutGroup>
              <div className="pf__opts" role="tablist">
                {TABS.map(([k, l, hint, c]) => (
                  <button key={k} role="tab" aria-selected={tab === k} className={`pf__opt ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)} data-cursor="hide">
                    {tab === k && <motion.span layoutId="ev-tab" className="pf__bg" transition={{ duration: 0.5, ease: EASE }} />}
                    <span className="pf__text">
                      <span className="pf__name">{l}</span>
                      <span className="pf__hint">{hint}</span>
                    </span>
                    <span className="pf__count">{c}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'upcoming' ? (
              <motion.div key="up" className="evg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                {upcoming.length === 0 && <p className="lede mute">New events are announced soon. Join the newsletter below to hear first.</p>}
                {upcoming.map((e, i) => {
                  const left = seatsLeft(e)
                  const d = new Date(e.date + 'T00:00:00')
                  return (
                    <Reveal key={e.id} delay={(i % 2) * 0.08}>
                      <Link to={`/events/${e.id}`} className="evc" data-cursor="Book">
                        <div className="evc__poster"><EventPoster event={e} /></div>
                        <div className="evc__body">
                          <div className="evc__top">
                            <span className="evc__date">
                              <strong>{String(d.getDate()).padStart(2, '0')}</strong>
                              <span>{d.toLocaleDateString('en-IN', { month: 'short' })}<br />{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                            </span>
                            <span className="evc__price">{fmtPrice(e.price)}</span>
                          </div>
                          <span className="evc__kicker">{e.kicker}</span>
                          <h2 className="evc__title">{e.title}</h2>
                          <span className="evc__meta">{e.venue} · {e.time}</span>
                          <div className="evc__seats">
                            <div className="evc__bar"><span style={{ transform: `scaleX(${1 - left / e.seats})` }} /></div>
                            <span className={left < 20 ? 'is-low' : ''}>{left === 0 ? 'Sold out' : `${left} of ${e.seats} seats left`}</span>
                          </div>
                          <span className="evc__btn">{left === 0 ? 'View event' : 'Book seat'} <Arrow /></span>
                        </div>
                      </Link>
                    </Reveal>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div key="past" className="evp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                {past.map((e, i) => (
                  <Reveal key={e.id} delay={(i % 3) * 0.08}>
                    <Link to={`/events/${e.id}`} className="evp__item" data-cursor="View">
                      <EventPoster event={e} past />
                      <div className="evp__cap">
                        <span className="evp__date">{fmtDate(e.date, { month: 'long', year: 'numeric' })}</span>
                        <h3>{e.title}</h3>
                        <p>{e.description}</p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Page>
  )
}
