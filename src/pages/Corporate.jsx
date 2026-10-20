import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '../components/Page'
import ProgramIcon from '../components/ProgramIcon'
import { Arrow, Btn, EASE, Marquee, Mascot, Reveal, SplitText, Star } from '../components/ui'
import { useStore } from '../store/Store'
import { KeynoteDeck } from './Home'

const OFFERS = [
  { t: 'Executive Presence', d: 'Gravitas, stillness and the voice of authority for senior leaders and rising stars.', f: '1:1 · 6 sessions', icon: 'leadership-presence', tone: '#fbb03b' },
  { t: 'Presentations that Land', d: 'From slide-reading to storytelling. Structure, visuals and delivery for business presentations.', f: 'Workshop · 1 day', icon: 'public-speaking', tone: '#ffffff' },
  { t: 'Pitching & Persuasion', d: 'Sales, fundraising and internal pitches. Frame the problem, sell the vision, handle objections.', f: 'Cohort · 4 weeks', icon: 'debating', tone: '#fde3b0' },
  { t: 'Storytelling with Data', d: 'Turn dashboards into decisions. Narrative arcs for analysts and product teams.', f: 'Workshop · ½ day', icon: 'storytelling', tone: '#e0731a' },
  { t: 'Leadership Communication', d: 'All-hands, town halls, feedback and difficult conversations for new and senior managers.', f: 'Program · 8 weeks', icon: 'interview-mastery', tone: '#fbb03b' },
  { t: 'Team Offsites', d: 'High-energy improv, debate and storytelling formats that build trust and laughter.', f: 'Custom · on-site', icon: 'theatre-expression', tone: '#ffffff' },
]

const STEPS = [
  ['Diagnose', 'A short call and a recorded baseline of how your people present today.'],
  ['Design', 'A program built around your real meetings, decks and audiences, not generic theory.'],
  ['Deliver', 'Playful, high-repetition practice with on-camera feedback and coach notes.'],
  ['Measure', 'Before/after scoring and a debrief report for HR and leadership.'],
]

export default function Corporate() {
  return (
    <Page title="Corporate training">
      <section className="kn t-dark co-hero">
        <div className="container kn__grid">
          <div className="kn__copy">
            <div className="page-hero__index">
              <span className="num">(C)</span>
              <span className="eyebrow">Miyagi for teams · New</span>
            </div>
            <SplitText as="h1" className="co-hero__title" immediate delay={0.75}>
              {['Boardrooms', 'are just', <span key="b" className="italic amber">bigger classrooms.</span>]}
            </SplitText>
            <Reveal as="p" className="kn__lede" delay={1}>
              The playful, high-repetition method that built 12,000 confident students, rebuilt for leaders, sales teams and everyone who presents for a living.
            </Reveal>
            <Reveal className="kn__stats" delay={1.05}>
              <div><strong>+38%</strong><span>avg. presentation score</span></div>
              <div><strong>120+</strong><span>teams trained</span></div>
              <div><strong>4.8★</strong><span>facilitator rating</span></div>
            </Reveal>
            <Reveal className="kn__ctas" delay={1.1}>
              <Btn href="#corp-enquire" variant="amber">Plan a session</Btn>
              <Btn href="#offers" variant="ghost" icon={false}>See formats</Btn>
            </Reveal>
          </div>
          <KeynoteDeck />
        </div>
      </section>

      <Marquee className="corp-logos t-ink" items={['Vardhan Finserv', 'Kestrel Bank', 'Medisense', 'Brightloop', 'Quanta Labs', 'Tarang Retail', 'Indus Capital']} speed={44} />

      <section className="co-off t-paper" id="offers">
        <div className="container">
          <div className="pp-sec-head">
            <div>
              <div className="section-head__meta">
                <span className="num">(01)</span>
                <span className="eyebrow">What we offer</span>
              </div>
              <SplitText className="pp-sec-title">{['Formats for every', <span key="r" className="italic">room you lead.</span>]}</SplitText>
            </div>
            <Reveal as="p" className="pp-sec-aside">Workshops, cohorts and one-on-one coaching. Run on-site, online or at your offsite.</Reveal>
          </div>
          <div className="co-off__grid">
            {OFFERS.map((o, i) => (
              <Reveal key={o.t} delay={(i % 3) * 0.08}>
                <a href="#corp-enquire" className="co-card" style={{ '--tone': o.tone }}>
                  <div className="co-card__top">
                    <span className="co-card__ic"><ProgramIcon slug={o.icon} /></span>
                    <span className="co-card__fmt">{o.f}</span>
                  </div>
                  <h3 className="co-card__t">{o.t}</h3>
                  <p className="co-card__d">{o.d}</p>
                  <span className="co-card__go">Enquire <Arrow /></span>
                </a>
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
                <span className="eyebrow">How it works</span>
              </div>
              <SplitText className="pp-sec-title">{['Four steps.', <span key="z" className="italic amber">Zero fluff.</span>]}</SplitText>
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

      <section className="co-quote t-amber">
        <div className="container co-quote__in">
          <span className="co-quote__mark" aria-hidden>“</span>
          <Reveal>
            <blockquote>The best two days our leadership team has spent together. Practical, playful and genuinely transformative.</blockquote>
            <div className="co-quote__who">
              <span className="eq__av">N</span>
              <span><strong>Neha J.</strong><em>VP People, fintech</em></span>
            </div>
          </Reveal>
        </div>
      </section>

      <CorpForm />
    </Page>
  )
}

const SIZES = ['1–10', '10–50', '50–200', '200+']
const FORMATS = ['Workshop', 'Cohort', '1:1 coaching', 'Offsite']

function CorpForm() {
  const { addLead } = useStore()
  const [sent, setSent] = useState(false)
  const [f, setF] = useState({ name: '', company: '', email: '', size: '10–50', format: 'Workshop', message: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  return (
    <section className="eq t-dark" id="corp-enquire">
      <div className="container">
        <div className="eq__wrap">
          <div className="eq__side">
            <div className="eq__eyebrow"><span className="num">(03)</span> Let’s talk</div>
            <SplitText as="h2" className="eq__title">{['Bring Miyagi', <span key="t" className="italic">to your team.</span>]}</SplitText>
            <p className="eq__lede">Share a few details and we’ll send a tailored proposal within 48 hours.</p>
            <ul className="eq__promise">
              <li><Star /> Custom to your industry & audience</li>
              <li><Star /> On-site across India or online</li>
              <li><Star /> Measurable before/after scoring</li>
            </ul>
            <div className="eq__coach">
              <span className="eq__av">R</span>
              <p>“Tell me about your team and I’ll design the session myself.”<em>Rohan Kapoor · Lead, corporate training</em></p>
            </div>
          </div>
          <div className="eq__card">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" className="eq__ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }}>
                  <span className="eq__ok-mascot"><Mascot animated ink="#000" band="#fbb03b" /></span>
                  <h3>Proposal incoming.</h3>
                  <p>Thanks {f.name.split(' ')[0]}, we’ll be in touch at <strong>{f.email}</strong> within 48 hours.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="f"
                  className="eq__form"
                  exit={{ opacity: 0 }}
                  onSubmit={(e) => {
                    e.preventDefault()
                    addLead({ ...f, program: 'Corporate', id: Date.now().toString(36), createdAt: new Date().toISOString() })
                    setSent(true)
                  }}
                >
                  <div className="eq__group">
                    <span className="eq__label">Team size</span>
                    <div className="eq__chips">
                      {SIZES.map((s) => <button type="button" key={s} className={f.size === s ? 'is-on' : ''} onClick={() => setF({ ...f, size: s })} data-cursor="hide">{s}</button>)}
                    </div>
                  </div>
                  <div className="eq__group">
                    <span className="eq__label">Interested in</span>
                    <div className="eq__chips">
                      {FORMATS.map((s) => <button type="button" key={s} className={f.format === s ? 'is-on' : ''} onClick={() => setF({ ...f, format: s })} data-cursor="hide">{s}</button>)}
                    </div>
                  </div>
                  <div className="eq__row">
                    <label className="eq__field"><span>Name</span><input required value={f.name} onChange={set('name')} placeholder="Full name" /></label>
                    <label className="eq__field"><span>Company</span><input required value={f.company} onChange={set('company')} placeholder="Organisation" /></label>
                  </div>
                  <label className="eq__field"><span>Work email</span><input required type="email" value={f.email} onChange={set('email')} placeholder="you@company.com" /></label>
                  <label className="eq__field"><span>What would you like to improve? <em>(optional)</em></span><textarea rows="3" value={f.message} onChange={set('message')} placeholder="E.g. quarterly business reviews, sales pitches…" /></label>
                  <button className="eq__submit" data-cursor="hide">Request a proposal <span><Arrow dir="r" /></span></button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
