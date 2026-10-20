import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import Page from '../components/Page'
import HeroHome from '../components/HeroHome'
import ProgramIcon from '../components/ProgramIcon'
import EventPoster from '../components/EventPoster'
import { Arrow, Btn, Counter, EASE, Marquee, Mascot, Reveal, SectionHead, SplitText, Star } from '../components/ui'
import { programs } from '../data/programs'
import { belts, stats, testimonials } from '../data/content'
import { fmtDate, fmtPrice, useStore } from '../store/Store'

export default function Home() {
  return (
    <Page>
      <HeroHome />
      <Marquee
        className="home-marquee t-amber"
        items={['Public speaking', 'Debating', 'Storytelling', 'Theatre', 'MUN', 'Interviews', 'Leadership', 'Creative writing']}
        speed={36}
      />
      <Beliefs />
      <Audiences />
      <ProgramsShowcase />
      <Method />
      <Stats />
      <OnStage />
      <Voices />
      <CorporateBand />
      <JournalTeaser />
    </Page>
  )
}

const BELIEFS = [
  ['“She’s just shy.”', 'She hasn’t been heard yet.'],
  ['“Some kids are natural speakers.”', 'Every speaker is built, rep by rep.'],
  ['“Don’t be nervous.”', 'Nerves are fuel. We teach you to use them.'],
  ['“Speak when you’re ready.”', 'You get ready by speaking.'],
]

function Beliefs() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const orbY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const ghostY = useTransform(scrollYProgress, [0, 1], ['30%', '-30%'])
  return (
    <section className="bl t-paper" ref={ref}>
      <div className="bl__bg" aria-hidden>
        <motion.div className="bl__orbs" style={{ y: orbY }}>
          <span className="bl__orb bl__orb--1" />
          <span className="bl__orb bl__orb--2" />
          <span className="bl__orb bl__orb--3" />
        </motion.div>
        <div className="bl__dots" />
        <motion.div className="bl__ghost" style={{ y: ghostY }}>
          <div className="bl__ghost-track">
            {Array.from({ length: 4 }).map((_, k) => (
              <span key={k}>Practice · Repeat ·&nbsp;</span>
            ))}
          </div>
        </motion.div>
        <div className="bl__wave bl__wave--1"><span /></div>
        <div className="bl__wave bl__wave--2"><span /></div>
      </div>
      <div className="container bl__content">
        <div className="bl__head">
          <div className="section-head__meta">
            <span className="num">(01)</span>
            <span className="eyebrow">What we believe</span>
          </div>
          <h2 className="bl__title">
            <Reveal as="span" className="bl__t1">Confidence isn’t a personality.</Reveal>
            <Reveal as="span" className="bl__t2" delay={0.12}>
              It’s a{' '}
              <span className="bl__mark">
                <motion.i
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                  transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
                />
                <span>practice.</span>
              </span>
              <motion.span
                className="bl__sticker"
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 8 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 170, damping: 14, delay: 0.9 }}
              >
                <img src="/assets/kid-crop.jpg" alt="" />
              </motion.span>
            </Reveal>
          </h2>
        </div>

        <div className="bl__labels">
          <span className="label">What people say</span>
          <span className="label">What we know</span>
        </div>
        <ol className="bl__rows">
          {BELIEFS.map(([myth, truth], i) => (
            <motion.li
              key={myth}
              className="bl__row"
              initial="off"
              whileInView="on"
              viewport={{ once: true, margin: '0px 0px -18% 0px' }}
            >
              <span className="num bl__num">0{i + 1}</span>
              <motion.span className="bl__myth" variants={{ off: { opacity: 1 }, on: { opacity: 0.38, transition: { delay: 0.55, duration: 0.5 } } }}>
                {myth}
                <motion.i className="bl__strike" variants={{ off: { scaleX: 0 }, on: { scaleX: 1, transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0.15 } } }} />
              </motion.span>
              <motion.span className="bl__arrow" variants={{ off: { opacity: 0, x: -14 }, on: { opacity: 1, x: 0, transition: { delay: 0.6, duration: 0.5 } } }}>
                <Arrow dir="r" />
              </motion.span>
              <motion.span className="bl__truth" variants={{ off: { opacity: 0, x: 30 }, on: { opacity: 1, x: 0, transition: { delay: 0.7, duration: 0.8, ease: EASE } } }}>
                {truth}
              </motion.span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const AUD = [
  { key: 'schools', label: 'Schools', unit: 'Grades', range: '3–12', blurb: 'In-timetable curriculum, speaking clubs and inter-school leagues, run inside your campus.', to: '/programs?for=schools', theme: 'amber' },
  { key: 'colleges', label: 'Colleges', unit: 'Ages', range: '18–24', blurb: 'Placement prep, MUN, debate societies and campus leadership. Workshops or full semesters.', to: '/programs?for=colleges', theme: 'white' },
  { key: 'individuals', label: 'Individuals', unit: 'Ages', range: '7–70', blurb: 'Small weekend and online batches for kids, students and adults who want to speak up.', to: '/programs?for=individuals', theme: 'paper' },
  { key: 'teams', label: 'Teams', unit: 'Team size', range: '5–500', blurb: 'Executive presence, pitching and leadership communication for companies.', to: '/corporate', theme: 'ink', programs: ['Executive Presence', 'Pitching', 'Storytelling with Data', 'Offsites'] },
]

function Audiences() {
  const [active, setActive] = useState(0)
  return (
    <section className="au t-dark">
      <div className="container au__wrap">
        <div className="au__head">
          <div>
            <div className="section-head__meta">
              <span className="num">(02)</span>
              <span className="eyebrow">Who it’s for</span>
            </div>
            <SplitText className="au__title">{['Built for every', <span key="s" className="italic amber">stage of life.</span>]}</SplitText>
          </div>
          <Reveal as="p" className="au__intro" delay={0.2}>
            From a seven-year-old’s first show-and-tell to a CEO’s first all-hands.
          </Reveal>
        </div>

        <div className="au__panels">
          {AUD.map((a, i) => {
            const list = a.programs || programs.filter((p) => p.audiences.includes(a.key)).map((p) => p.title)
            return (
              <Reveal key={a.key} delay={i * 0.08} className={`au__cell ${active === i ? 'is-on' : ''}`} onMouseEnter={() => setActive(i)}>
                <Link to={a.to} className={`au__panel au__panel--${a.theme}`} onFocus={() => setActive(i)} data-cursor="hide">
                  <div className="au__top">
                    <span className="num">0{i + 1}</span>
                    <span className="au__count">{list.length} programs</span>
                  </div>
                  <div className="au__fig">
                    <span className="label">{a.unit}</span>
                    <span className="au__range">{a.range}</span>
                  </div>
                  <div className="au__more">
                    <div>
                      <p>{a.blurb}</p>
                      <div className="au__chips">
                        {list.slice(0, 5).map((t) => <span key={t}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="au__foot">
                    <span className="au__label">{a.label}</span>
                    <span className="au__go"><Arrow /></span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const AUTOPLAY = 4600
const audLabel = (p) => p.audiences.map((a) => a[0].toUpperCase() + a.slice(1)).join(' · ')
const pad = (n) => String(n).padStart(2, '0')

function ProgramsShowcase() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const [layers, setLayers] = useState([{ id: 0, tone: programs[0].tone }])
  const p = programs[active]

  const go = (i) => {
    if (i === active) return
    setActive(i)
    setLayers((l) => [...l.slice(-1), { id: l[l.length - 1].id + 1, tone: programs[i].tone }])
  }

  useEffect(() => {
    if (!auto) return
    const t = setTimeout(() => go((active + 1) % programs.length), AUTOPLAY)
    return () => clearTimeout(t)
  }, [active, auto]) // eslint-disable-line react-hooks/exhaustive-deps

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 120, damping: 16 })
  const sry = useSpring(ry, { stiffness: 120, damping: 16 })
  const tilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8)
  }
  const untilt = () => { rx.set(0); ry.set(0) }

  return (
    <section className="ps t-ink section">
      <div className="container">
        <SectionHead index="03" eyebrow="Programs" title={['Eight disciplines.', <span key="b" className="italic amber">One confident you.</span>]}>
          Every program is small-batch, coach-led and ends on a real stage. Pick a discipline to see what you’ll practise.
        </SectionHead>

        <div className="ps__grid" onMouseEnter={() => setAuto(false)}>
          <ol className="ps__list">
            {programs.map((q, i) => (
              <li key={q.slug}>
                <Link
                  to={`/programs/${q.slug}`}
                  className={`ps__item ${i === active ? 'is-on' : ''}`}
                  onMouseEnter={() => go(i)}
                  onFocus={() => { setAuto(false); go(i) }}
                  data-cursor="hide"
                >
                  {i === active && <motion.span layoutId="ps-bar" className="ps__bar" transition={{ duration: 0.5, ease: EASE }} />}
                  <span className="ps__lead">
                    <span className="num">{pad(i + 1)}</span>
                    <span className="ps__mini"><ProgramIcon slug={q.slug} /></span>
                  </span>
                  <span className="ps__name" aria-label={q.title}>
                    {(() => {
                      let n = 0
                      return q.title.split(' ').map((w, wi) => (
                        <span key={wi} className="ps__word">
                          {[...w].map((c, k) => (
                            <span key={k} className="ps__ch" style={{ '--i': n++ }} data-c={c}>{c}</span>
                          ))}
                        </span>
                      ))
                    })()}
                  </span>
                  <span className="ps__aud">{audLabel(q)}</span>
                  <span className="ps__go"><Arrow /></span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="ps__preview">
            <motion.div className="ps__tilt" style={{ rotateX: srx, rotateY: sry }} onMouseMove={tilt} onMouseLeave={untilt}>
              <Link to={`/programs/${p.slug}`} className="ps__card" data-cursor="Explore">
                <div className="ps__cover">
                  {layers.map((l) => (
                    <motion.span
                      key={l.id}
                      className="ps__flood"
                      style={{ background: l.tone, zIndex: l.id }}
                      initial={l.id === 0 ? false : { clipPath: 'circle(0% at 76% 46%)' }}
                      animate={{ clipPath: 'circle(150% at 76% 46%)' }}
                      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                    />
                  ))}
                  <div className="ps__cover-in">
                    <span className="ps__cover-top">
                      <span>{audLabel(p)}</span>
                      <span>{p.duration}</span>
                    </span>
                    <span className="ps__bignum" aria-hidden>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span key={active} initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
                          {pad(active + 1)}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="ps__icon" key={p.slug}>
                      <ProgramIcon slug={p.slug} draw="mount" delay={0.25} />
                    </span>
                    <span className="ps__tagline" key={p.slug + 't'}>
                      {p.tagline.split(' ').map((w, k) => (
                        <span key={k} className="ps__tw">
                          <motion.span initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 0.7, ease: EASE, delay: 0.2 + k * 0.05 }}>
                            {w}&nbsp;
                          </motion.span>
                        </span>
                      ))}
                    </span>
                  </div>
                </div>

                <div className="ps__body" key={p.slug + 'b'}>
                  <div className="ps__body-head">
                    <motion.h3 className="ps__title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>{p.title}</motion.h3>
                    <span className="ps__cta-btn"><Arrow /></span>
                  </div>
                  <div className="ps__mods">
                    <span className="label mute">You’ll practise</span>
                    {p.modules.slice(0, 3).map((m, k) => (
                      <motion.div key={m.t} className="ps__mod" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.15 + k * 0.07 }}>
                        <span className="num">{pad(k + 1)}</span>
                        <span>{m.t}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="ps__facts">
                    <span><em>Ages</em>{p.ages}</span>
                    <span><em>Format</em>{p.format}</span>
                    <span><em>Batch</em>{p.batch}</span>
                  </div>
                </div>
              </Link>
            </motion.div>

            <div className="ps__segs">
              {programs.map((q, i) => (
                <button key={q.slug} className={`ps__seg ${i === active ? 'is-on' : ''} ${i < active ? 'is-done' : ''}`} onClick={() => { setAuto(false); go(i) }} aria-label={q.title}>
                  {i === active && <span key={active + String(auto)} className={`ps__seg-fill ${auto ? 'is-auto' : ''}`} style={{ animationDuration: AUTOPLAY + 'ms' }} />}
                </button>
              ))}
              <span className="ps__count num">{pad(active + 1)} / {pad(programs.length)}</span>
            </div>
          </div>
        </div>

        <MobilePrograms />

        <div className="ps__more">
          <Btn to="/programs" variant="ghost" icon={false}>Compare all programs</Btn>
        </div>
      </div>
    </section>
  )
}

function MobilePrograms() {
  const ref = useRef(null)
  const [idx, setIdx] = useState(0)
  const onScroll = () => {
    const el = ref.current
    const card = el.firstElementChild
    if (!card) return
    setIdx(Math.round(el.scrollLeft / (card.offsetWidth + 14)))
  }
  return (
    <div className="ps__mobile">
      <div className="ps__swipe" ref={ref} onScroll={onScroll}>
        {programs.map((q, i) => (
          <Link key={q.slug} to={`/programs/${q.slug}`} className="ps__card ps__card--m">
            <div className="ps__cover" style={{ backgroundColor: q.tone }}>
              <div className="ps__cover-in">
                <span className="ps__cover-top">
                  <span>{q.duration}</span>
                  <span>{q.ages}</span>
                </span>
                <span className="ps__bignum" aria-hidden><span>{pad(i + 1)}</span></span>
                <span className="ps__icon"><ProgramIcon slug={q.slug} draw="view" delay={0.1} /></span>
                <span className="ps__tagline">{q.tagline}</span>
              </div>
            </div>
            <div className="ps__body">
              <div className="ps__body-head">
                <h3 className="ps__title">{q.title}</h3>
                <span className="ps__cta-btn"><Arrow /></span>
              </div>
              <span className="ps__m-aud">{audLabel(q)}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="ps__dots">
        {programs.map((q, i) => <span key={q.slug} className={i === idx ? 'is-on' : ''} />)}
      </div>
    </div>
  )
}

function Method() {
  const [active, setActive] = useState(2)
  return (
    <section className="method t-paper">
      <div className="container method__grid">
        <SectionHead index="04" eyebrow="The Miyagi Method" title={['Wax on.', <span key="w" className="italic">Wax off.</span>]}>
          Like any martial art, confidence is earned one belt at a time. Every Miyagi student progresses through five stages, each with its own skills, challenges and showcase.
        </SectionHead>
        <motion.div className="belts" initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -15% 0px' }}>
          {belts.map((b, i) => (
            <motion.button
              key={b.name}
              className={`belt ${active === i ? 'is-active' : ''}`}
              style={{ '--belt': b.color, '--belt-ink': b.ink }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              variants={{
                hidden: { clipPath: 'inset(0% 100% 0% 0% round 18px)' },
                show: { clipPath: 'inset(0% 0% 0% 0% round 18px)', transition: { duration: 1.2, ease: EASE, delay: i * 0.1 } },
              }}
              data-cursor="hide"
            >
              <span className="belt__num num">0{i + 1}</span>
              <span className="belt__name">{b.name} belt</span>
              <span className="belt__line">{b.line}</span>
              <span className="belt__stage label">{b.stage}</span>
              <AnimatePresence initial={false}>
                {active === i && (
                  <motion.span
                    className="belt__more"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <span className="belt__d">{b.d}</span>
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="belt__knot" aria-hidden />
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="stats t-amber">
      <div className="container stats__grid">
        {stats.map((s, i) => (
          <Reveal key={s.label} className="stat" delay={i * 0.08}>
            <span className="stat__value">
              <Counter value={s.value} suffix={s.suffix} />
            </span>
            <span className="stat__label">{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function OnStage() {
  const { upcoming, seatsLeft } = useStore()
  const list = upcoming.slice(0, 4)
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto || list.length < 2) return
    const t = setTimeout(() => setActive((v) => (v + 1) % list.length), 6000)
    return () => clearTimeout(t)
  }, [active, auto, list.length])

  if (!list.length) return null
  const e = list[Math.min(active, list.length - 1)]
  const left = seatsLeft(e)

  return (
    <section className="os t-dark">
      <div className="container">
        <div className="os__head">
          <div>
            <div className="section-head__meta">
              <span className="num">(05)</span>
              <span className="eyebrow">Events · Now booking</span>
            </div>
            <SplitText className="os__title">{['On stage', <span key="n" className="italic amber">next.</span>]}</SplitText>
          </div>
          <Link to="/events" className="os__all link-u">All events & past galleries <Arrow /></Link>
        </div>

        <div className="os__grid" onMouseEnter={() => setAuto(false)}>
          <Link to={`/events/${e.id}`} className="tk" data-cursor="Book">
            <div className="tk__stub">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={e.id}
                  className="tk__poster"
                  initial={{ rotateY: -80, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 80, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                >
                  <EventPoster event={e} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="tk__main">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={e.id} className="tk__info" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}>
                  <span className="tk__kicker">{e.kicker}</span>
                  <h3 className="tk__title">{e.title}</h3>
                  <div className="tk__facts">
                    <span><em>Date</em>{fmtDate(e.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span><em>Time</em>{e.time}</span>
                    <span><em>Ticket</em>{fmtPrice(e.price)}</span>
                  </div>
                  <span className="tk__venue">{e.venue}</span>
                </motion.div>
              </AnimatePresence>
              <FlipCountdown target={new Date(e.date + 'T' + (e.time || '10:00'))} />
              <div className="tk__foot">
                <div className="tk__seats">
                  <div className="tk__bar"><motion.span key={e.id} initial={{ scaleX: 0 }} animate={{ scaleX: 1 - left / e.seats }} transition={{ duration: 1, ease: EASE }} /></div>
                  <span>{left} of {e.seats} seats left</span>
                </div>
                <span className="tk__btn">Book your seat <Arrow /></span>
              </div>
              <span className="tk__admit" aria-hidden>Admit one · Miyagi · Admit one</span>
              <span className="tk__code" aria-hidden />
            </div>
          </Link>

          <div className="board">
            <div className="board__head">
              <span className="label">Also coming up</span>
              <span className="label mute">{list.length} events</span>
            </div>
            {list.map((ev, i) => {
              const d = new Date(ev.date + 'T00:00:00')
              return (
                <Link
                  key={ev.id}
                  to={`/events/${ev.id}`}
                  className={`board__row ${i === active ? 'is-on' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => { setAuto(false); setActive(i) }}
                  data-cursor="hide"
                >
                  {i === active && <motion.span layoutId="board-hl" className="board__hl" transition={{ duration: 0.5, ease: EASE }} />}
                  <span className="board__date">
                    <span className="flapset">{String(d.getDate()).padStart(2, '0').split('').map((c, k) => <span key={k} className="flap">{c}</span>)}</span>
                    <span className="board__mon">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
                  </span>
                  <span className="board__info">
                    <span className="board__title">{ev.title}</span>
                    <span className="board__venue">{ev.venue.split(',')[0]} · {ev.time}</span>
                  </span>
                  <span className="board__price">{fmtPrice(ev.price)}</span>
                  <span className="board__go"><Arrow /></span>
                </Link>
              )
            })}
            {auto && <span key={active} className="board__timer" />}
          </div>
        </div>
      </div>
    </section>
  )
}

export function FlipCountdown({ target }) {
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
    <div className="fc">
      {parts.map(([l, v], pi) => (
        <div key={l} className="fc__unit">
          <span className="flapset">
            {String(v).padStart(2, '0').split('').map((c, k) => (
              <span key={k} className="flap flap--lg">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={c + '-' + pi + k}
                    initial={{ rotateX: -90, opacity: 0.4 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
                  >
                    {c}
                  </motion.span>
                </AnimatePresence>
              </span>
            ))}
          </span>
          <span className="fc__label">{l}</span>
        </div>
      ))}
    </div>
  )
}

const WORD_MS = 300
const TONES = ['#fbb03b', '#fde3b0', '#e0731a', '#ffffff']
const waveBars = (seed, n) =>
  Array.from({ length: n }, (_, k) => {
    const v = Math.abs(Math.sin(seed * 12.9898 + k * 0.71) * 0.6 + Math.sin(k * 0.37 + seed) * 0.4)
    return 0.18 + v * 0.82
  })
const fmtSec = (s) => `0:${String(Math.round(s)).padStart(2, '0')}`

function Voices() {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-25% 0px -25% 0px' })
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [w, setW] = useState(0)
  const n = testimonials.length
  const t = testimonials[i]
  const words = t.quote.split(' ')
  const totalSec = (words.length * WORD_MS) / 1000
  const progress = Math.min(1, w / words.length)
  const bars = useMemo(() => waveBars(i + 1, 56), [i])

  useEffect(() => {
    if (!playing || !inView) return
    const iv = setInterval(() => setW((v) => v + 1), WORD_MS)
    return () => clearInterval(iv)
  }, [playing, inView, i])

  useEffect(() => {
    if (w >= words.length + 6) {
      setI((x) => (x + 1) % n)
      setW(0)
    }
  }, [w, words.length, n])

  const pick = (k) => {
    setI(k)
    setW(0)
    setPlaying(true)
  }

  return (
    <section className="vn t-paper" ref={ref}>
      <div className="container">
        <div className="vn__head">
          <div>
            <div className="section-head__meta">
              <span className="num">(06)</span>
              <span className="eyebrow">In their words</span>
            </div>
            <SplitText className="vn__title">{['Hear it from', <span key="t" className="italic">them.</span>]}</SplitText>
          </div>
          <div className="vn__rating">
            <span className="vn__stars">★★★★★</span>
            <span><strong>4.9</strong> from 2,300+ parents & students</span>
          </div>
        </div>

        <div className="vn__grid">
          <div className="vn__player">
            <div className="vn__who">
              <span className="vn__avatar" style={{ background: TONES[i % TONES.length] }}>{t.name[0]}</span>
              <div>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
              <span className="vn__live"><i className={playing && inView ? 'is-on' : ''} /> Voice note</span>
            </div>

            <div className="vn__deck">
              <button className="vn__play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'} data-cursor="hide">
                {playing ? (
                  <svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z" fill="currentColor" /></svg>
                )}
              </button>
              <div className="vn__wave">
                <div className="vn__bars">
                  {bars.map((h, k) => <span key={k} style={{ transform: `scaleY(${h})` }} />)}
                </div>
                <div className="vn__bars vn__bars--on" style={{ clipPath: `inset(0 ${100 - progress * 100}% 0 0)` }}>
                  {bars.map((h, k) => <span key={k} style={{ transform: `scaleY(${h})` }} />)}
                </div>
              </div>
              <span className="vn__time">{fmtSec(Math.min(totalSec, (w * WORD_MS) / 1000))} / {fmtSec(totalSec)}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p key={i} className="vn__quote" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
                <span className="vn__mark">“</span>
                {words.map((word, k) => (
                  <span key={k} className={`vn__w ${k < w ? 'is-said' : ''} ${k === w - 1 ? 'is-now' : ''}`}>{word} </span>
                ))}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="vn__list">
            {testimonials.map((q, k) => {
              const mini = waveBars(k + 1, 34)
              const secs = (q.quote.split(' ').length * WORD_MS) / 1000
              return (
                <button key={q.name} className={`vn__item ${k === i ? 'is-on' : ''}`} onClick={() => pick(k)} data-cursor="hide">
                  <span className="vn__avatar vn__avatar--sm" style={{ background: TONES[k % TONES.length] }}>{q.name[0]}</span>
                  <span className="vn__bubble">
                    <span className="vn__item-top">
                      <strong>{q.name}</strong>
                      <span>{q.role}</span>
                    </span>
                    <span className="vn__mini">
                      <span className="vn__mini-play">
                        {k === i && playing ? (
                          <svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
                        ) : (
                          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                        )}
                      </span>
                      <span className="vn__mini-bars">{mini.map((h, j) => <span key={j} style={{ transform: `scaleY(${h})` }} />)}</span>
                      <span className="vn__mini-dur">{fmtSec(secs)}</span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const SLIDE_MS = 4800
const SLIDES = [
  {
    key: 'presence',
    theme: 'amber',
    note: 'Pause. Make eye contact. Then click.',
    render: () => (
      <>
        <span className="sl__tag">01 · Executive Presence</span>
        <h4 className="sl__big">Gravitas is a skill.</h4>
        <div className="sl__trio">
          {['Stillness', 'Conviction', 'Clarity'].map((w, k) => (
            <motion.span key={w} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + k * 0.12, duration: 0.5, ease: EASE }}>{w}</motion.span>
          ))}
        </div>
      </>
    ),
  },
  {
    key: 'present',
    theme: 'white',
    note: 'Nobody ever complained a deck was too short.',
    render: () => (
      <>
        <span className="sl__tag">02 · Presentations that Land</span>
        <div className="sl__ba">
          <div>
            <span className="sl__label">Before</span>
            <motion.span className="sl__num sl__num--strike" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>42</motion.span>
            <span className="sl__cap">slides, 3 fonts, 0 story</span>
          </div>
          <span className="sl__arrow"><Arrow dir="r" /></span>
          <div>
            <span className="sl__label">After</span>
            <motion.span className="sl__num sl__num--amber" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 14 }}>7</motion.span>
            <span className="sl__cap">slides, one clear ask</span>
          </div>
        </div>
      </>
    ),
  },
  {
    key: 'pitch',
    theme: 'black',
    note: 'Sell the problem before the product.',
    render: () => (
      <>
        <span className="sl__tag">03 · Pitching & Persuasion</span>
        <h4 className="sl__big">Every pitch has three acts.</h4>
        <div className="sl__steps">
          {['Problem', 'Vision', 'Ask'].map((w, k) => (
            <motion.span key={w} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + k * 0.15, duration: 0.5, ease: EASE }}>
              <em>{k + 1}</em>
              {w}
            </motion.span>
          ))}
        </div>
      </>
    ),
  },
  {
    key: 'data',
    theme: 'paper',
    note: 'One chart. One point. Then stop talking.',
    render: () => (
      <>
        <span className="sl__tag">04 · Storytelling with Data</span>
        <div className="sl__chart">
          {[38, 52, 46, 61, 94, 58].map((h, k) => (
            <motion.span
              key={k}
              className={k === 4 ? 'is-hl' : ''}
              style={{ height: h + '%' }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.25 + k * 0.08, duration: 0.6, ease: EASE }}
            >
              {k === 4 && <motion.i initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>This is the story.</motion.i>}
            </motion.span>
          ))}
        </div>
      </>
    ),
  },
  {
    key: 'lead',
    theme: 'ember',
    note: 'Silence is a leadership tool.',
    render: () => (
      <>
        <span className="sl__tag">05 · Leadership Communication</span>
        <h4 className="sl__huge">
          Say less.
          <br />
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>Mean more.</motion.span>
        </h4>
      </>
    ),
  },
]

export function KeynoteDeck() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px' })
  const n = SLIDES.length
  const go = (step) => {
    setDir(step)
    setI((v) => (v + step + n) % n)
  }
  useEffect(() => {
    if (paused || !inView) return
    const t = setTimeout(() => go(1), SLIDE_MS)
    return () => clearTimeout(t)
  }, [i, paused, inView]) // eslint-disable-line react-hooks/exhaustive-deps
  const slide = SLIDES[i]

  return (
    <div ref={ref} className="kn__deck">
      <Reveal className="kn__stage" delay={0.1}>
        <div className="kn__screen" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="kn__bar">
            <span className="kn__dots"><i /><i /><i /></span>
            <span>Miyagi × Your Team · Workshop deck</span>
            <span className="kn__rec"><i /> Live</span>
          </div>
          <div className="kn__slides">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={slide.key}
                custom={dir}
                className={`sl sl--${slide.theme}`}
                variants={{
                  enter: (d) => ({ x: d > 0 ? '100%' : '-100%' }),
                  center: { x: '0%', scale: 1, opacity: 1 },
                  exit: (d) => ({ x: d > 0 ? '-30%' : '30%', scale: 0.92, opacity: 0.4 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
              >
                {slide.render()}
                <span className="sl__brand"><Mascot ink="currentColor" band={slide.theme === 'black' ? '#fbb03b' : '#fff'} /></span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="kn__base" aria-hidden />
  
        <div className="kn__controls">
          <button onClick={() => go(-1)} aria-label="Previous slide" data-cursor="hide"><Arrow dir="l" /></button>
          <div className="kn__progress">
            <div className="kn__segs">
              {SLIDES.map((sl, k) => (
                <span key={sl.key} className={k < i ? 'is-done' : k === i ? 'is-on' : ''}>
                  {k === i && <i key={i + String(paused || !inView)} className={!paused && inView ? 'is-run' : ''} style={{ animationDuration: SLIDE_MS + 'ms' }} />}
                </span>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.span key={slide.key} className="kn__note" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                <em>Presenter notes:</em> {slide.note}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="kn__count num">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <button onClick={() => go(1)} aria-label="Next slide" data-cursor="hide"><Arrow dir="r" /></button>
        </div>
      </Reveal>
    </div>
  )
}

function CorporateBand() {

  return (
    <section className="kn t-dark">
      <div className="container kn__grid">
        <div className="kn__copy">
          <div className="section-head__meta">
            <span className="num">(07)</span>
            <span className="eyebrow">Miyagi for teams · New</span>
          </div>
          <SplitText className="kn__title">{['Boardrooms are just', <span key="b" className="italic amber">bigger classrooms.</span>]}</SplitText>
          <Reveal as="p" className="kn__lede" delay={0.15}>
            The playful, high-repetition method that built 12,000 confident students, rebuilt for leaders, sales teams and everyone who presents for a living.
          </Reveal>
          <Reveal className="kn__stats" delay={0.25}>
            <div><strong>+38%</strong><span>avg. presentation score</span></div>
            <div><strong>120+</strong><span>teams trained</span></div>
            <div><strong>4.8★</strong><span>facilitator rating</span></div>
          </Reveal>
          <Reveal className="kn__trust" delay={0.3}>
            <span className="label mute">Trusted by teams at</span>
            <span className="kn__logos">Vardhan Finserv · Kestrel Bank · Quanta Labs · Indus Capital</span>
          </Reveal>
          <Reveal className="kn__ctas" delay={0.35}>
            <Btn to="/corporate" variant="amber">Corporate training</Btn>
            <Btn to="/corporate#corp-enquire" variant="ghost" icon={false}>Plan a session</Btn>
          </Reveal>
        </div>

        <KeynoteDeck />
      </div>
    </section>
  )
}

function JournalTeaser() {
  const { publishedPosts } = useStore()
  const [feat, ...rest] = publishedPosts
  const list = rest.slice(0, 3)
  if (!feat) return null

  return (
    <section className="jm t-white">
      <div className="container">
        <div className="jm__head">
          <div>
            <div className="section-head__meta">
              <span className="num">(08)</span>
              <span className="eyebrow">Journal</span>
            </div>
            <SplitText className="jm__title">{['Notes from', <span key="d" className="italic">the dojo.</span>]}</SplitText>
          </div>
          <Link to="/journal" className="jm__all link-u">All articles <Arrow /></Link>
        </div>

        <div className="jm__grid">
          <Reveal>
            <Link to={`/journal/${feat.id}`} className="jm__feat" data-cursor="Read">
              <div className={`jm__cover cover--${feat.theme}`}>
                <span className="jm__cat">{feat.category}</span>
                <span className="jm__glyph">{feat.glyph || feat.category}</span>
                <Mascot className="jm__mascot" ink={feat.theme === 'black' ? '#fbb03b' : '#000'} band={feat.theme === 'amber' ? '#fff' : '#fbb03b'} />
              </div>
              <div className="jm__feat-body">
                <span className="label mute">{fmtDate(feat.date, { day: 'numeric', month: 'long' })} · {feat.read} min read</span>
                <h3 className="jm__feat-title">{feat.title}</h3>
                <p className="jm__excerpt">{feat.excerpt}</p>
                <span className="jm__read">Read article <Arrow /></span>
              </div>
            </Link>
          </Reveal>

          <div className="jm__index">
            {list.map((p, k) => (
              <Reveal key={p.id} delay={0.1 + k * 0.08}>
                <Link to={`/journal/${p.id}`} className="jm__row" data-cursor="Read">
                  <span className="jm__row-main">
                    <span className="jm__row-cat">{p.category} · {p.read} min read</span>
                    <span className="jm__row-title">{p.title}</span>
                  </span>
                  <span className="jm__row-go"><Arrow /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function PostCard({ post, large = false }) {
  return (
    <Link to={`/journal/${post.id}`} className={`postcard ${large ? 'postcard--lg' : ''}`} data-cursor="Read">
      <div className={`postcard__cover cover--${post.theme}`}>
        <span className="postcard__cat">{post.category}</span>
        <span className="postcard__glyph" aria-hidden>{post.glyph || post.category}</span>
        <Mascot className="postcard__mascot" ink={post.theme === 'black' ? '#fbb03b' : '#000'} band={post.theme === 'amber' ? '#fff' : '#fbb03b'} />
      </div>
      <div className="postcard__body">
        <span className="label mute">{fmtDate(post.date)} · {post.read} min read</span>
        <h3 className="postcard__title">{post.title}</h3>
        {large && <p className="postcard__excerpt">{post.excerpt}</p>}
      </div>
    </Link>
  )
}
