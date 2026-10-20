import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '../components/Page'
import Accordion from '../components/Accordion'
import { Btn, EASE, Mascot, Reveal, SplitText } from '../components/ui'
import { useStore } from '../store/Store'

const FAQ = [
  { t: 'What age can my child start?', d: 'Storytelling and theatre start at 6. Public speaking from 8, debating from 11. Adults are welcome in our individual and corporate tracks.' },
  { t: 'Is the trial class really free?', d: 'Yes. A 30-minute trial with a coach. No payment details, no obligation.' },
  { t: 'Do you run programs inside schools?', d: 'We partner with 140+ schools to deliver weekly in-timetable sessions, clubs and inter-school leagues. Write to us for a school proposal.' },
  { t: 'Online or in person?', d: 'Both. Studio batches run in Delhi NCR; online cohorts are live, small and camera-on.' },
  { t: 'How do event bookings work?', d: 'Choose an event, select seats and pay securely via Razorpay (UPI, cards, netbanking). Your e-ticket arrives by email instantly.' },
]

export default function Contact() {
  const { addLead } = useStore()
  const [sent, setSent] = useState(false)
  const [topic, setTopic] = useState('Free trial class')
  const [f, setF] = useState({ name: '', email: '', phone: '', message: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const topics = ['Free trial class', 'School partnership', 'College workshop', 'Corporate training', 'Something else']

  return (
    <Page title="Contact" cta={false}>
      <section className="contact t-dark">
        <div className="grain" />
        <div className="container contact__grid">
          <div className="contact__side">
            <div className="page-hero__index">
              <span className="num">(C)</span>
              <span className="eyebrow">Contact</span>
            </div>
            <SplitText as="h1" className="display contact__title" immediate delay={0.75}>
              {['Let’s', <span key="t" className="italic amber">talk.</span>]}
            </SplitText>
            <Reveal delay={1} className="contact__details">
              <a href="mailto:hello@miyagi.in" className="contact__big link-u">hello@miyagi.in</a>
              <a href="tel:+919800000000" className="contact__big link-u">+91 98000 00000</a>
              <div className="contact__addr">
                <span className="label mute">Studio</span>
                <span>Miyagi Studio, Sector 29<br />Gurugram, Haryana 122002</span>
              </div>
              <div className="contact__addr">
                <span className="label mute">Hours</span>
                <span>Tue – Sun · 10am – 7pm</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.9} className="contact__card">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" className="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }}>
                  <Mascot animated ink="#000" band="#fff" />
                  <h3>Message received.</h3>
                  <p>Thanks {f.name.split(' ')[0]}. We reply to every message within one working day.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="f"
                  exit={{ opacity: 0 }}
                  onSubmit={(e) => {
                    e.preventDefault()
                    addLead({ ...f, program: topic, id: Date.now().toString(36), createdAt: new Date().toISOString() })
                    setSent(true)
                  }}
                >
                  <span className="label">I’m interested in</span>
                  <div className="topics">
                    {topics.map((t) => (
                      <button type="button" key={t} className={`topic ${topic === t ? 'is-on' : ''}`} onClick={() => setTopic(t)} data-cursor="hide">{t}</button>
                    ))}
                  </div>
                  <div className="form-grid">
                    <div className="field"><label htmlFor="n">Name</label><input id="n" required value={f.name} onChange={set('name')} placeholder="Full name" /></div>
                    <div className="field"><label htmlFor="p">Phone</label><input id="p" type="tel" value={f.phone} onChange={set('phone')} placeholder="+91" /></div>
                    <div className="field full"><label htmlFor="e">Email</label><input id="e" required type="email" value={f.email} onChange={set('email')} placeholder="you@email.com" /></div>
                    <div className="field full"><label htmlFor="m">Message</label><textarea id="m" value={f.message} onChange={set('message')} placeholder="Tell us a little more…" /></div>
                    <div className="full"><Btn variant="black" type="submit" magnetic={false}>Send message</Btn></div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>

      <section className="faq t-paper section">
        <div className="container faq__grid">
          <div>
            <div className="section-head__meta">
              <span className="num">(01)</span>
              <span className="eyebrow">FAQ</span>
            </div>
            <SplitText className="h2">{['Good', <span key="q" className="italic">questions.</span>]}</SplitText>
          </div>
          <Accordion items={FAQ} />
        </div>
      </section>
    </Page>
  )
}
