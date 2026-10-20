import { Link, Navigate, useParams } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import Page from '../components/Page'
import { Arrow, Reveal, SplitText } from '../components/ui'
import { fmtDate, useStore } from '../store/Store'
import { PostCard } from './Home'

export default function Post() {
  const { id } = useParams()
  const { publishedPosts } = useStore()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const post = publishedPosts.find((p) => p.id === id)
  if (!post) return <Navigate to="/journal" replace />
  const more = publishedPosts.filter((p) => p.id !== id).slice(0, 2)
  const [first, ...body] = post.body

  return (
    <Page title={post.title}>
      <motion.div className="read-progress" style={{ scaleX: progress }} />
      <article className="post t-white">
        <header className="post__head container">
          <Link to="/journal" className="pd-back link-u"><Arrow dir="l" /> Journal</Link>
          <div className="post__meta">
            <span className="chip chip--amber">{post.category}</span>
            <span className="label">{fmtDate(post.date, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="label">{post.read} min read</span>
          </div>
          <SplitText as="h1" className="h1 post__title" immediate delay={0.75} stagger={0.04}>{post.title}</SplitText>
          <Reveal delay={1} className="post__author">
            <span className="voices__avatar">{post.author[0]}</span>
            <span>
              <strong>{post.author}</strong>
              <span className="mute-dark">Coach, Miyagi</span>
            </span>
          </Reveal>
        </header>
        <div className="post__body container">
          <Reveal as="p" className="post__lead">{first}</Reveal>
          {body.map((para, i) => (
            <Reveal as="p" key={i}>{para}</Reveal>
          ))}
        </div>
      </article>
      {more.length > 0 && (
        <section className="t-white section--tight post__more">
          <div className="container">
            <span className="eyebrow">Keep reading</span>
            <div className="jgrid jgrid--two">
              {more.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}
    </Page>
  )
}
