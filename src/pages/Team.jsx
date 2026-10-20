import Page from '../components/Page'
import { Btn, Mascot, Reveal, SplitText } from '../components/ui'
import { team } from '../data/content'

const initials = (n) => n.split(' ').map((s) => s[0]).join('')
const FOUNDER_FACTS = [
  ['10', 'years coaching'],
  ['40+', 'tournaments judged'],
  ['12k', 'students coached'],
]

export default function Team() {
  const [founder, ...rest] = team
  return (
    <Page title="Team">
      <section className="tmh t-dark">
        <div className="tmh__glow" aria-hidden />
        <div className="container">
          <div className="tmh__head">
            <div>
              <div className="page-hero__index">
                <span className="num">(T)</span>
                <span className="eyebrow">The coaches · {team.length} senseis</span>
              </div>
              <SplitText as="h1" className="tmh__title" immediate delay={0.75}>
                {['The people', <span key="b" className="italic amber">behind the mic.</span>]}
              </SplitText>
            </div>
            <Reveal delay={1}>
              <p className="tmh__lede">Debate champions, actors, authors, recruiters and teachers. Each one was once a nervous beginner too.</p>
            </Reveal>
          </div>

          <Reveal delay={1.05} className="fd">
            <div className="fd__portrait">
              <span className="fd__init">{initials(founder.name)}</span>
              <span className="fd__mascot"><Mascot animated ink="#000" band="#fff" /></span>
              <span className="fd__badge">Founder</span>
            </div>
            <div className="fd__body">
              <span className="label amber">{founder.role}</span>
              <h2 className="fd__name">{founder.name}</h2>
              <p className="fd__quote">“I was the kid who rehearsed one question for a whole lesson and never asked it. Miyagi is for that kid.”</p>
              <p className="fd__bio">{founder.bio}</p>
              <div className="fd__facts">
                {FOUNDER_FACTS.map(([v, l]) => (
                  <div key={l}><strong>{v}</strong><span>{l}</span></div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="tg t-paper">
        <div className="container">
          <div className="pp-sec-head">
            <div>
              <div className="section-head__meta">
                <span className="num">(01)</span>
                <span className="eyebrow">The coaching team</span>
              </div>
              <SplitText className="pp-sec-title">{['Meet your', <span key="s" className="italic">senseis.</span>]}</SplitText>
            </div>
            <Reveal as="p" className="pp-sec-aside">Hover a coach to read their story.</Reveal>
          </div>
          <div className="tg__grid">
            {rest.map((p, i) => (
              <Reveal key={p.name} delay={(i % 4) * 0.07}>
                <article className={`tc tc--${p.tone}`}>
                  <div className="tc__art">
                    <span className="tc__init">{initials(p.name)}</span>
                    <span className="tc__mascot"><Mascot ink={p.tone === 'black' ? '#fbb03b' : '#000'} band={p.tone === 'amber' ? '#fff' : '#fbb03b'} /></span>
                    <p className="tc__bio">{p.bio}</p>
                  </div>
                  <div className="tc__info">
                    <h3>{p.name}</h3>
                    <span>{p.role}</span>
                  </div>
                </article>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <div className="tc tc--join">
                <span className="tc__join-plus">+</span>
                <h3>Could this be you?</h3>
                <p>We’re always looking for great coaches who love the stage.</p>
                <Btn to="/contact" variant="black" magnetic={false}>Join the team</Btn>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Page>
  )
}
