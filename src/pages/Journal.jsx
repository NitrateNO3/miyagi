import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import Page from '../components/Page'
import { Arrow, EASE, Mascot, Reveal, SplitText } from '../components/ui'
import { fmtDate, useStore } from '../store/Store'

const TONE = { amber: '#fbb03b', black: '#141414', paper: '#ece4d6' }
const pullQuote = (p) => {
  const s = (p.body?.[1] || p.excerpt || '').split(/(?<=\.)\s/)[0]
  return s.length > 150 ? s.slice(0, 147) + '…' : s
}

export default function Journal() {
  const { publishedPosts } = useStore()
  const cats = ['All', ...new Set(publishedPosts.map((p) => p.category))]
  const [cat, setCat] = useState('All')
  const list = cat === 'All' ? publishedPosts : publishedPosts.filter((p) => p.category === cat)
  const [feat, ...rest] = list

  return (
    <Page title="Journal">
      {/* ---------------- Hero */}
      <section className="jn-hero t-dark">
        <div className="container">
          <div className="jn-hero__head">
            <div>
              <div className="page-hero__index">
                <span className="num">(J)</span>
                <span className="eyebrow">The Miyagi Journal</span>
              </div>
              <SplitText as="h1" className="jn-hero__title" immediate delay={0.75}>
                {['Notes from', <span key="d" className="italic amber">the dojo.</span>]}
              </SplitText>
            </div>
            <Reveal delay={1}>
              <p className="jn-hero__lede">Practical ideas on speaking well — written by our coaches for parents, students and leaders. One new note every fortnight.</p>
            </Reveal>
          </div>
          <Reveal delay={1.05} className="pf jn-hero__filter">
            <span className="pf__label">Topics</span>
            <LayoutGroup>
              <div className="pf__opts" role="tablist">
                {cats.map((c) => (
                  <button key={c} role="tab" aria-selected={cat === c} className={`pf__opt pf__opt--sm ${cat === c ? 'is-on' : ''}`} onClick={() => setCat(c)} data-cursor="hide">
                    {cat === c && <motion.span layoutId="j-tab" className="pf__bg" transition={{ duration: 0.5, ease: EASE }} />}
                    <span className="pf__name">{c}</span>
                    <span className="pf__count">{c === 'All' ? publishedPosts.length : publishedPosts.filter((p) => p.category === c).length}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Stories */}
      <section className="jn t-paper">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              {feat && (
                <Link to={`/journal/${feat.id}`} className="jn-feat" data-cursor="Read">
                  <div className={`jn-feat__cover jn-feat__cover--${feat.theme}`}>
                    <span className="jn-feat__tag">Featured · {feat.category}</span>
                    <blockquote className="jn-feat__quote">“{pullQuote(feat)}”</blockquote>
                    <span className="jn-feat__mascot"><Mascot ink={feat.theme === 'black' ? '#fbb03b' : '#000'} band={feat.theme === 'amber' ? '#fff' : '#fbb03b'} /></span>
                  </div>
                  <div className="jn-feat__body">
                    <span className="jn-meta">{fmtDate(feat.date, { day: 'numeric', month: 'long', year: 'numeric' })} · {feat.read} min read</span>
                    <h2 className="jn-feat__title">{feat.title}</h2>
                    <p className="jn-feat__excerpt">{feat.excerpt}</p>
                    <div className="jn-feat__foot">
                      <span className="jn-av">{feat.author[0]}</span>
                      <span className="jn-who"><strong>{feat.author}</strong><em>Coach, Miyagi</em></span>
                      <span className="jn-feat__read">Read <Arrow /></span>
                    </div>
                  </div>
                </Link>
              )}

              {rest.length > 0 && (
                <div className="jn-list">
                  <div className="jn-list__head">
                    <span className="label">More notes</span>
                    <span className="label mute">{rest.length} article{rest.length > 1 ? 's' : ''}</span>
                  </div>
                  {rest.map((p, i) => (
                    <Reveal key={p.id} delay={i * 0.06}>
                      <Link to={`/journal/${p.id}`} className="jn-row" data-cursor="hide">
                        <span className="jn-row__date">
                          <strong>{fmtDate(p.date, { day: '2-digit' })}</strong>
                          <span>{fmtDate(p.date, { month: 'short', year: 'numeric' })}</span>
                        </span>
                        <span className="jn-row__main">
                          <span className="jn-row__cat">{p.category} · {p.read} min read</span>
                          <span className="jn-row__title">{p.title}</span>
                          <span className="jn-row__excerpt">{p.excerpt}</span>
                        </span>
                        <span className="jn-row__thumb" style={{ background: TONE[p.theme] }}>
                          <Mascot ink={p.theme === 'black' ? '#fbb03b' : '#000'} band={p.theme === 'amber' ? '#fff' : '#fbb03b'} />
                        </span>
                        <span className="jn-row__go"><Arrow /></span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Page>
  )
}
