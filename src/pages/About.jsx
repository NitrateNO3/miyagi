import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Page from '../components/Page'
import { Btn, Counter, EASE, Mascot, Reveal, SplitText } from '../components/ui'
import { stats } from '../data/content'

const TIMELINE = [
  ['2016', 'Seven students, one borrowed classroom', 'Miyagi begins as a Saturday speaking club in South Delhi.'],
  ['2018', 'The first championship', 'The Junior Orator Open draws 300 speakers from 40 schools.'],
  ['2020', 'The mic goes online', 'Live virtual classes reach learners in 60 cities during lockdown.'],
  ['2023', '100 partner schools', 'Miyagi’s in-school curriculum becomes part of the weekly timetable.'],
  ['2026', 'Miyagi for teams', 'The method that works for kids launches for leaders and companies.'],
]

const VALUES = [
  ['Practice over talent', 'Nobody is “a natural”. Every great speaker is simply someone who practised more.'],
  ['Play before polish', 'Games, improv and laughter come first. Fear leaves the room when fun walks in.'],
  ['Every voice counts', 'The quiet kid, the second-language speaker, the over-thinker — all welcome, all heard.'],
  ['The stage is real', 'Every program ends with a real audience. That is where confidence is made.'],
]

export default function About() {
  const tl = useRef(null)
  const { scrollYProgress } = useScroll({ target: tl, offset: ['start 70%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <Page title="About">
      {/* ---------------- Hero */}
      <section className="ab-hero t-dark">
        <div className="ab-hero__glow" aria-hidden />
        <div className="container ab-hero__grid">
          <div>
            <div className="page-hero__index">
              <span className="num">(A)</span>
              <span className="eyebrow">About Miyagi</span>
            </div>
            <SplitText as="h1" className="ab-hero__title" immediate delay={0.75}>
              {['We teach the', 'skill school', <span key="f" className="italic amber">forgot.</span>]}
            </SplitText>
            <Reveal delay={1}>
              <p className="ab-hero__lede">Maths, science, languages — all on the timetable. But the skill that decides interviews, friendships and careers? Speaking up. That’s where we come in.</p>
            </Reveal>
            <Reveal delay={1.1} className="ab-hero__ctas">
              <Btn to="/programs" variant="amber">Explore programs</Btn>
              <Btn to="/team" variant="ghost" icon={false}>Meet the coaches</Btn>
            </Reveal>
          </div>

          <div className="ab-hero__visual">
            <motion.div
              className="ab-hero__photo"
              initial={{ clipPath: 'inset(100% 0% 0% 0% round 30px)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0% round 30px)' }}
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
            >
              <motion.img src="/assets/kid-full.jpg" alt="A student celebrating with two thumbs up" initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: EASE, delay: 0.8 }} />
            </motion.div>
            <motion.div className="ab-chip ab-chip--a" initial={{ opacity: 0, y: 20, rotate: -8 }} animate={{ opacity: 1, y: 0, rotate: -4 }} transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 1.5 }}>
              <span className="label">Week 1</span>
              <p>Hid behind the curtain.</p>
            </motion.div>
            <motion.div className="ab-chip ab-chip--b" initial={{ opacity: 0, y: 20, rotate: 10 }} animate={{ opacity: 1, y: 0, rotate: 4 }} transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 1.7 }}>
              <span className="label">Week 12</span>
              <p>Hosted the school assembly.</p>
            </motion.div>
            <motion.div className="ab-chip ab-chip--m" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 170, damping: 14, delay: 1.9 }}>
              <Mascot animated ink="#000" band="#fff" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- Stats strip */}
      <section className="ab-stats t-amber">
        <div className="container ab-stats__row">
          {stats.map((s) => (
            <div key={s.label} className="ab-stat">
              <strong><Counter value={s.value} suffix={s.suffix} /></strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Name story */}
      <section className="ab-name t-paper">
        <div className="container ab-name__grid">
          <Reveal className="ab-name__tile">
            <Mascot animated ink="#000" band="#fff" />
            <span className="ab-name__wax">Wax on. <em>Wax off.</em></span>
          </Reveal>
          <div className="ab-name__copy">
            <div className="section-head__meta">
              <span className="num">(01)</span>
              <span className="eyebrow">Why “Miyagi”?</span>
            </div>
            <SplitText className="pp-sec-title">{['Named after the', <span key="m" className="italic">patient master.</span>]}</SplitText>
            <Reveal className="ab-name__body">
              <p>In the film, Mr. Miyagi never lectures. He hands his student a sponge and says “wax on, wax off” — and through hundreds of small, repeated motions, a champion is quietly built.</p>
              <p>That is exactly how communication is learned. Not through theory, but through practice: one sentence, one pause, one brave raised hand at a time.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Timeline */}
      <section className="cu t-dark" style={{ '--tone': '#fbb03b' }}>
        <div className="container cu__grid">
          <div className="cu__side">
            <div className="section-head__meta">
              <span className="num">(02)</span>
              <span className="eyebrow">Our story</span>
            </div>
            <SplitText className="cu__title">{['Ten years', <span key="x" className="italic amber">on stage.</span>]}</SplitText>
            <p className="ab-tl__note">From a borrowed classroom to 140+ partner schools — one brave voice at a time.</p>
          </div>
          <ol className="cu__list" ref={tl}>
            <span className="cu__rail" aria-hidden><motion.span style={{ scaleY: fill }} /></span>
            {TIMELINE.map(([y, t, d], i) => (
              <Reveal as="li" key={y} delay={0.05} className={`cu__item ${i === TIMELINE.length - 1 ? 'is-last' : ''}`}>
                <span className="cu__node">’{y.slice(2)}</span>
                <div className="cu__card">
                  <span className="cu__week">{y}</span>
                  <h3 className="cu__t">{t}</h3>
                  <p className="cu__d">{d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Values */}
      <section className="ab-val t-paper">
        <div className="container">
          <div className="pp-sec-head">
            <div>
              <div className="section-head__meta">
                <span className="num">(03)</span>
                <span className="eyebrow">What we stand for</span>
              </div>
              <SplitText className="pp-sec-title">{['Four things we', <span key="n" className="italic">never compromise.</span>]}</SplitText>
            </div>
          </div>
          <div className="ab-val__grid">
            {VALUES.map(([t, d], i) => (
              <Reveal key={t} className={`ab-val__card ${i === 0 ? 'is-amber' : ''} ${i === 3 ? 'is-dark' : ''}`} delay={i * 0.08}>
                <span className="ab-val__n">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
