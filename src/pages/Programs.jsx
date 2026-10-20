import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import Page from '../components/Page'
import ProgramIcon from '../components/ProgramIcon'
import { Arrow, EASE, Reveal, SplitText } from '../components/ui'
import { programs } from '../data/programs'

const FILTERS = [
  { key: 'all', label: 'All programs', hint: 'Every age' },
  { key: 'schools', label: 'Schools', hint: 'Grades 3–12' },
  { key: 'colleges', label: 'Colleges', hint: 'Ages 18–24' },
  { key: 'individuals', label: 'Individuals', hint: 'Ages 7–70' },
]
const pad = (n) => String(n).padStart(2, '0')
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const countFor = (key) => (key === 'all' ? programs.length : programs.filter((p) => p.audiences.includes(key)).length)

const PATHS = [
  { age: '6 – 10', who: 'Young explorers', line: 'Build expression through stories, play and the stage.', picks: ['storytelling', 'theatre-expression', 'public-speaking'], tone: '#fde3b0' },
  { age: '11 – 17', who: 'Teens & students', line: 'Sharpen arguments, structure and stage presence.', picks: ['public-speaking', 'debating', 'mun-diplomacy'], tone: '#fbb03b' },
  { age: '18 +', who: 'College & adults', line: 'Interviews, leadership and confident communication at work.', picks: ['interview-mastery', 'leadership-presence', 'creative-writing'], tone: '#ffffff' },
]

const STEPS = [
  ['Free trial class', '30 minutes with a coach to find the right starting belt.'],
  ['Small batch', 'Never more than 16 learners, so everyone speaks every class.'],
  ['Weekly practice', 'Drills, games and recorded rounds with written feedback.'],
  ['Live showcase', 'Every program ends on a real stage, in front of a real audience.'],
]

export default function Programs() {
  const [params, setParams] = useSearchParams()
  const active = FILTERS.some((f) => f.key === params.get('for')) ? params.get('for') : 'all'
  const list = active === 'all' ? programs : programs.filter((p) => p.audiences.includes(active))
  const opts = useRef(null)

  useEffect(() => {
    const row = opts.current
    const on = row?.querySelector('.pf__opt.is-on')
    if (row && on && row.scrollWidth > row.clientWidth) row.scrollTo({ left: on.offsetLeft - 16, behavior: 'smooth' })
  }, [active])

  return (
    <Page title="Programs">
      <section className="pp-hero t-dark">
        <div className="pp-hero__glow" aria-hidden />
        <div className="container pp-hero__grid">
          <div className="pp-hero__copy">
            <div className="page-hero__index">
              <span className="num">(P)</span>
              <span className="eyebrow">Programs · {programs.length} disciplines</span>
            </div>
            <SplitText as="h1" className="pp-hero__title" immediate delay={0.75}>
              {['Pick your', <span key="a" className="italic amber">discipline.</span>]}
            </SplitText>
            <Reveal delay={1}>
              <p className="pp-hero__lede">Eight coach-led programs for every age. Each one is small-batch, practice-first and finished on a real stage.</p>
            </Reveal>
            <Reveal delay={1.1} className="pp-hero__meta">
              <span><strong>6 – 70</strong> ages</span>
              <span><strong>≤ 16</strong> per batch</span>
              <span><strong>100%</strong> end on stage</span>
            </Reveal>
          </div>

          <div className="pp-mosaic">
            {programs.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, scale: 0.6, rotate: i % 2 ? 8 : -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.9 + i * 0.07 }}
              >
                <Link to={`/programs/${p.slug}`} className="pp-tile" style={{ background: p.tone }} data-cursor="hide">
                  <span className="pp-tile__no">{pad(i + 1)}</span>
                  <ProgramIcon slug={p.slug} draw="mount" delay={1.2 + i * 0.07} />
                  <span className="pp-tile__name">{p.short}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pp t-dark">
        <div className="container">
          <div className="pf">
            <span className="pf__label">Browse</span>
            <LayoutGroup>
              <div className="pf__opts" ref={opts} role="tablist" aria-label="Filter programs by audience">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    role="tab"
                    aria-selected={active === f.key}
                    className={`pf__opt ${active === f.key ? 'is-on' : ''}`}
                    onClick={() => setParams(f.key === 'all' ? {} : { for: f.key }, { replace: true, preventScrollReset: true })}
                    data-cursor="hide"
                  >
                    {active === f.key && <motion.span layoutId="pf-bg" className="pf__bg" transition={{ duration: 0.5, ease: EASE }} />}
                    <span className="pf__text">
                      <span className="pf__name">{f.label}</span>
                      <span className="pf__hint">{f.hint}</span>
                    </span>
                    <span className="pf__count">{countFor(f.key)}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </div>

          <motion.div layout className="pp-grid">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => {
                const idx = programs.indexOf(p)
                const featured = i === 0 && active === 'all'
                return (
                  <motion.div
                    key={p.slug}
                    layout
                    className={featured ? 'pp-grid__feat' : ''}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: EASE, delay: Math.min(i, 6) * 0.05 }}
                  >
                    <Link to={`/programs/${p.slug}`} className={`pc ${featured ? 'pc--feat' : ''}`} style={{ '--tone': p.tone }} data-cursor="Explore">
                      <div className="pc__cover">
                        <span className="pc__no">{pad(idx + 1)}</span>
                        <span className="pc__dur">{p.duration}</span>
                        {featured && <span className="pc__badge">★ Most popular</span>}
                        <span className="pc__icon"><ProgramIcon slug={p.slug} draw="view" delay={0.15} /></span>
                        {featured && <span className="pc__tagline">{p.tagline}</span>}
                      </div>
                      <div className="pc__body">
                        <div className="pc__head">
                          <h3 className="pc__title">{p.title}</h3>
                          <span className="pc__go"><Arrow /></span>
                        </div>
                        <p className="pc__text">{featured ? p.intro : p.tagline}</p>
                        <div className="pc__chips">
                          {p.audiences.map((a) => <span key={a}>{cap(a)}</span>)}
                        </div>
                        <div className="pc__facts">
                          <span><em>Ages</em>{p.ages}</span>
                          <span><em>Format</em>{p.format}</span>
                          {featured && <span><em>Batch</em>{p.batch}</span>}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="pp-paths t-paper">
        <div className="container">
          <div className="pp-sec-head">
            <div>
              <div className="section-head__meta">
                <span className="num">(01)</span>
                <span className="eyebrow">Not sure where to start?</span>
              </div>
              <SplitText className="pp-sec-title">{['Start with', <span key="a" className="italic">their age.</span>]}</SplitText>
            </div>
            <Reveal as="p" className="pp-sec-aside">Or book a free trial and a coach will recommend the right starting belt.</Reveal>
          </div>
          <div className="pp-paths__grid">
            {PATHS.map((path, k) => (
              <Reveal key={path.age} delay={k * 0.1} className="path" style={{ '--tone': path.tone }}>
                <div className="path__top">
                  <span className="path__age">{path.age}</span>
                  <span className="path__who">{path.who}</span>
                </div>
                <p className="path__line">{path.line}</p>
                <div className="path__picks">
                  {path.picks.map((slug) => {
                    const p = programs.find((x) => x.slug === slug)
                    return (
                      <Link key={slug} to={`/programs/${slug}`} className="path__pick" data-cursor="hide">
                        <span className="path__pick-ic" style={{ background: p.tone }}><ProgramIcon slug={slug} /></span>
                        <span>{p.title}</span>
                        <Arrow />
                      </Link>
                    )
                  })}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-how t-dark">
        <div className="container">
          <div className="pp-sec-head">
            <div>
              <div className="section-head__meta">
                <span className="num">(02)</span>
                <span className="eyebrow">How every program works</span>
              </div>
              <SplitText className="pp-sec-title">{['Practice first.', <span key="a" className="italic amber">Stage last.</span>]}</SplitText>
            </div>
          </div>
          <ol className="pp-how__steps">
            {STEPS.map(([t, d], k) => (
              <Reveal as="li" key={t} delay={k * 0.1} className="step">
                <span className="step__n">{k + 1}</span>
                <span className="step__line" aria-hidden />
                <h3 className="step__t">{t}</h3>
                <p className="step__d">{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </Page>
  )
}
