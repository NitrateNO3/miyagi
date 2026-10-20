import { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import Page from '../components/Page'
import { Arrow, Btn, EASE, Mascot, Reveal, SplitText, Star } from '../components/ui'
import { getProgram, programs } from '../data/programs'
import ProgramIcon from '../components/ProgramIcon'
import { useStore } from '../store/Store'

export default function ProgramDetail() {
  const { slug } = useParams()
  const p = getProgram(slug)
  if (!p) return <Navigate to="/programs" replace />
  const idx = programs.indexOf(p)
  const next = programs[(idx + 1) % programs.length]

  return (
    <Page title={p.title}>
      <section className="pd-hero t-dark" style={{ '--tone': p.tone }}>
        <div className="grain" />
        <div className="pd-hero__band" aria-hidden />
        <div className="container">
          <div className="page-hero__index">
            <Link to="/programs" className="pd-back link-u"><Arrow dir="l" /> All programs</Link>
            <span className="num">No. {String(idx + 1).padStart(2, '0')} / {String(programs.length).padStart(2, '0')}</span>
          </div>
          <SplitText as="h1" className="display pd-hero__title" immediate delay={0.75}>{p.title}</SplitText>
          <div className="pd-hero__row">
            <Reveal delay={1}>
              <p className="pd-hero__tagline">{p.tagline}</p>
            </Reveal>
            <Reveal delay={1.1} className="pd-hero__chips">
              {p.audiences.map((a) => (
                <span key={a} className="chip">{a}</span>
              ))}
            </Reveal>
          </div>
          <Reveal delay={1.15} className="pd-facts">
            {[
              ['Ages', p.ages],
              ['Duration', p.duration],
              ['Format', p.format],
              ['Batch', p.batch],
            ].map(([k, v]) => (
              <div key={k} className="pd-fact">
                <span className="label mute">{k}</span>
                <span className="pd-fact__v">{v}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="pd-ov t-paper">
        <div className="container pd-ov__grid">
          <Reveal className="pd-ov__card" style={{ '--tone': p.tone }}>
            <div className="pd-ov__cover">
              <span className="pd-ov__top">
                <span>No. {String(idx + 1).padStart(2, '0')}</span>
                <span>{p.duration}</span>
              </span>
              <span className="pd-ov__icon"><ProgramIcon slug={p.slug} draw="view" delay={0.2} /></span>
              <span className="pd-ov__tag">{p.tagline}</span>
            </div>
            <div className="pd-ov__inc">
              <span className="label mute">What’s included</span>
              <ul>
                {[
                  `${p.modules.length} coached modules`,
                  'Weekly recorded practice rounds',
                  'Personal coach feedback card',
                  'Live showcase + certificate',
                ].map((t) => (
                  <li key={t}><span className="pd-ov__tick">✓</span>{t}</li>
                ))}
              </ul>
              <a href="#enquire" className="pd-ov__cta">Book a free trial <Arrow /></a>
            </div>
          </Reveal>

          <div className="pd-ov__main">
            <div className="section-head__meta">
              <span className="num">(01)</span>
              <span className="eyebrow">Overview</span>
            </div>
            <SplitText as="p" className="pd-ov__intro" stagger={0.012}>{p.intro}</SplitText>
            <span className="label pd-ov__label">You’ll walk away able to</span>
            <ul className="pd-ov__outs">
              {p.outcomes.map((o, i) => (
                <Reveal as="li" key={o} delay={i * 0.08} className="pd-ov__out">
                  <span className="pd-ov__n">{String(i + 1).padStart(2, '0')}</span>
                  <span>{o}</span>
                </Reveal>
              ))}
            </ul>
            <div className="pd-ov__for">
              <span className="label mute">Made for</span>
              {p.audiences.map((a) => (
                <span key={a} className="chip">{a}</span>
              ))}
              <span className="chip chip--solid">{p.ages}</span>
            </div>
          </div>
        </div>
      </section>

      <Curriculum program={p} />

      <Enquire program={p} />

      <Link to={`/programs/${next.slug}`} className="pd-next t-amber" data-cursor="Next">
        <div className="container">
          <span className="label">Next program</span>
          <div className="pd-next__row">
            <span className="pd-next__title">{next.title}</span>
            <span className="pd-next__arrow"><Arrow dir="r" /></span>
          </div>
        </div>
      </Link>
    </Page>
  )
}

function Curriculum({ program: p }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const weeks = parseInt(p.duration, 10) || p.modules.length
  const per = weeks / p.modules.length
  const ends = p.modules.map((_, i) => Math.round((i + 1) * per))
  const range = (i) => {
    const a = i === 0 ? 1 : ends[i - 1] + 1
    const b = Math.max(a, ends[i])
    return a === b ? `Week ${a}` : `Weeks ${a}–${b}`
  }

  return (
    <section className="cu t-dark" style={{ '--tone': p.tone }}>
      <div className="container cu__grid">
        <div className="cu__side">
          <div className="section-head__meta">
            <span className="num">(02)</span>
            <span className="eyebrow">Curriculum</span>
          </div>
          <SplitText className="cu__title">{['What you’ll', <span key="x" className="italic amber">practise.</span>]}</SplitText>
          <div className="cu__stats">
            <div><strong>{p.modules.length}</strong><span>modules</span></div>
            <div><strong>{weeks}</strong><span>weeks</span></div>
            <div><strong>1</strong><span>live showcase</span></div>
          </div>
          <a href="#enquire" className="cu__syl link-u">Get the full syllabus <Arrow /></a>
        </div>

        <ol className="cu__list" ref={ref}>
          <span className="cu__rail" aria-hidden><motion.span style={{ scaleY: fill }} /></span>
          {p.modules.map((m, i) => {
            const last = i === p.modules.length - 1
            return (
              <Reveal as="li" key={m.t} delay={0.05} className={`cu__item ${last ? 'is-last' : ''}`}>
                <span className="cu__node">{String(i + 1).padStart(2, '0')}</span>
                <div className="cu__card">
                  <span className="cu__week">{range(i)}</span>
                  <h3 className="cu__t">{m.t}</h3>
                  <p className="cu__d">{m.d}</p>
                  {last && <span className="cu__flag">★ The finale</span>}
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

const WHO = [
  ['child', 'My child'],
  ['self', 'Myself'],
  ['school', 'A school / college'],
]
const MODE = ['In-person', 'Online', 'Either']

function Enquire({ program }) {
  const { addLead } = useStore()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', who: 'child', mode: 'Either', message: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    addLead({ ...form, program: program.title, id: Date.now().toString(36), createdAt: new Date().toISOString() })
    setSent(true)
  }

  return (
    <section className="eq t-dark" id="enquire">
      <div className="container">
        <div className="eq__wrap">
          <div className="eq__side">
            <div className="eq__eyebrow"><span className="num">(03)</span> Enquire</div>
            <SplitText as="h2" className="eq__title">{['Start with a', <span key="a" className="italic">free trial.</span>]}</SplitText>
            <p className="eq__lede">30 minutes with a coach to find the right starting belt for {program.title.toLowerCase()}. No payment, no pressure.</p>
            <ul className="eq__promise">
              <li><Star /> Free, no card needed</li>
              <li><Star /> Small batches of {program.batch.replace(' per batch', '')}</li>
              <li><Star /> Certificate & showcase at the end</li>
            </ul>
            <div className="eq__coach">
              <span className="eq__av">A</span>
              <p>“I’ll personally call you within one working day.”<em>Ananya Rao · Head coach</em></p>
            </div>
            <div className="eq__quick">
              <a href="https://wa.me/919800000000" target="_blank" rel="noreferrer">WhatsApp us</a>
              <a href="tel:+919800000000">Call +91 98000 00000</a>
            </div>
          </div>

          <div className="eq__card">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" className="eq__ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }}>
                  <span className="eq__ok-mascot"><Mascot animated ink="#000" band="#fbb03b" /></span>
                  <h3>You’re on the list, {form.name.split(' ')[0] || 'friend'}!</h3>
                  <p>We’ve got your trial request for <strong>{program.title}</strong>. Expect a call on {form.phone || 'your number'} within one working day.</p>
                  <Btn to="/programs" variant="black" magnetic={false}>Explore more programs</Btn>
                </motion.div>
              ) : (
                <motion.form key="f" className="eq__form" onSubmit={submit} exit={{ opacity: 0 }}>
                  <div className="eq__group">
                    <span className="eq__label">Enquiring for</span>
                    <div className="eq__chips">
                      {WHO.map(([k, l]) => (
                        <button type="button" key={k} className={form.who === k ? 'is-on' : ''} onClick={() => setForm({ ...form, who: k })} data-cursor="hide">{l}</button>
                      ))}
                    </div>
                  </div>
                  <div className="eq__group">
                    <span className="eq__label">Prefer</span>
                    <div className="eq__chips">
                      {MODE.map((m) => (
                        <button type="button" key={m} className={form.mode === m ? 'is-on' : ''} onClick={() => setForm({ ...form, mode: m })} data-cursor="hide">{m}</button>
                      ))}
                    </div>
                  </div>
                  <div className="eq__row">
                    <label className="eq__field"><span>Your name</span><input required value={form.name} onChange={set('name')} placeholder="Full name" /></label>
                    <label className="eq__field"><span>Phone</span><input required type="tel" value={form.phone} onChange={set('phone')} placeholder="+91" /></label>
                  </div>
                  <label className="eq__field"><span>Email</span><input required type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" /></label>
                  <label className="eq__field"><span>Anything we should know? <em>(optional)</em></span><textarea rows="3" value={form.message} onChange={set('message')} placeholder="Age, goals, preferred timings…" /></label>
                  <button className="eq__submit" data-cursor="hide">Request my free trial <span><Arrow dir="r" /></span></button>
                  <p className="eq__fine">We never share your details. Unsubscribe from updates anytime.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
