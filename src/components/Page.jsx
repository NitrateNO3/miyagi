import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Footer from './Footer'
import { Mascot } from './ui'

const CURTAIN = [0.76, 0, 0.24, 1]

/* Every route renders inside <Page>: amber curtain transition + footer. */
export default function Page({ title, children, footer = true, cta = true, className = '' }) {
  useEffect(() => {
    document.title = title ? `${title} — Miyagi` : 'Miyagi — The Communication Champ'
  }, [title])

  return (
    <>
      <motion.div
        className="curtain curtain--in"
        initial={{ y: '0%' }}
        animate={{ y: '-100%', transition: { duration: 0.9, ease: CURTAIN, delay: 0.15 } }}
        exit={{ y: '-100%' }}
        aria-hidden
      >
        <div className="curtain__mark">
          <Mascot ink="#000" band="#fff" />
          <span>{title || 'Miyagi'}</span>
        </div>
      </motion.div>
      <motion.div
        className="curtain curtain--out"
        initial={{ y: '100%' }}
        animate={{ y: '100%' }}
        exit={{ y: '0%', transition: { duration: 0.7, ease: CURTAIN } }}
        aria-hidden
      />
      <motion.main
        className={`page ${className}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1, transition: { duration: 0.7 } }}
      >
        {children}
        {footer && <Footer cta={cta} />}
      </motion.main>
    </>
  )
}
