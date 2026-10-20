import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import EventPoster from '../components/EventPoster'
import { EASE, Logo, Mascot } from '../components/ui'
import { fmtDate, fmtPrice, isPast, slugify, useStore } from '../store/Store'
import { lenis } from '../components/SmoothScroll'

const PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'miyagi2026'
const SESSION = 'miyagi-admin'

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION) === '1')
  useEffect(() => {
    document.title = 'Admin | Miyagi'
    lenis?.stop()
    return () => lenis?.start()
  }, [])
  return (
    <motion.div className="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      {authed ? <Dashboard onLogout={() => { sessionStorage.removeItem(SESSION); setAuthed(false) }} /> : <Login onOk={() => { sessionStorage.setItem(SESSION, '1'); setAuthed(true) }} />}
    </motion.div>
  )
}

function Login({ onOk }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  return (
    <div className="login">
      <div className="login__art">
        <Mascot animated ink="#000" band="#fff" />
        <p>“Wax on, wax off.”<br /><span>Publish events and posts, and track bookings. No developer needed.</span></p>
      </div>
      <form
        className="login__form"
        onSubmit={(e) => {
          e.preventDefault()
          pw === PASS ? onOk() : setErr(true)
        }}
      >
        <Link to="/"><Logo /></Link>
        <h1>Team login</h1>
        <div className="field">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" autoFocus value={pw} onChange={(e) => { setPw(e.target.value); setErr(false) }} placeholder="••••••••" />
        </div>
        {err && <p className="login__err">That password didn’t work.</p>}
        <button className="adm-btn adm-btn--amber">Sign in</button>
        <p className="login__hint">Demo password: <code>{PASS}</code></p>
      </form>
    </div>
  )
}

const TABS = [
  ['events', 'Events'],
  ['posts', 'Journal'],
  ['regs', 'Registrations'],
  ['leads', 'Enquiries'],
]

function Dashboard({ onLogout }) {
  const store = useStore()
  const [tab, setTab] = useState('events')
  const revenue = store.registrations.reduce((n, r) => n + r.amount, 0)
  const kpis = [
    ['Upcoming events', store.upcoming.length],
    ['Seats booked', store.registrations.reduce((n, r) => n + r.qty, 0)],
    ['Revenue', fmtPrice(revenue)],
    ['New enquiries', store.leads.length],
  ]

  return (
    <div className="dash">
      <aside className="dash__side">
        <Link to="/" className="dash__logo"><Logo /></Link>
        <nav>
          {TABS.map(([k, l]) => (
            <button key={k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>
              {l}
              {k === 'regs' && store.registrations.length > 0 && <em>{store.registrations.length}</em>}
              {k === 'leads' && store.leads.length > 0 && <em>{store.leads.length}</em>}
            </button>
          ))}
        </nav>
        <div className="dash__side-foot">
          <Link to="/" className="adm-link">← View website</Link>
          <button className="adm-link" onClick={onLogout}>Sign out</button>
        </div>
      </aside>
      <main className="dash__main" data-lenis-prevent>
        <header className="dash__head">
          <div>
            <span className="label">Miyagi admin</span>
            <h1>{TABS.find((t) => t[0] === tab)[1]}</h1>
          </div>
          <span className="dash__demo">Demo mode · data saved in this browser</span>
        </header>
        <div className="kpis">
          {kpis.map(([l, v]) => (
            <div key={l} className="kpi">
              <span>{l}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
            {tab === 'events' && <EventsAdmin />}
            {tab === 'posts' && <PostsAdmin />}
            {tab === 'regs' && <RegsAdmin />}
            {tab === 'leads' && <LeadsAdmin />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

const blankEvent = () => ({ id: '', title: '', kicker: '', date: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10), time: '10:00', venue: '', price: 999, seats: 100, theme: 'amber', poster: '', description: '', agenda: [] })

function EventsAdmin() {
  const { events, saveEvent, deleteEvent, seatsLeft } = useStore()
  const [edit, setEdit] = useState(null)
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <div className="adm-bar">
        <p className="adm-note">Events move to <strong>Past</strong> automatically the day after they happen.</p>
        <button className="adm-btn adm-btn--amber" onClick={() => setEdit(blankEvent())}>+ New event</button>
      </div>
      <div className="adm-cards">
        {sorted.map((e) => (
          <div key={e.id} className={`adm-ev ${isPast(e) ? 'is-past' : ''}`}>
            <div className="adm-ev__poster"><EventPoster event={e} past={isPast(e)} /></div>
            <div className="adm-ev__info">
              <span className={`adm-tag ${isPast(e) ? '' : 'adm-tag--live'}`}>{isPast(e) ? 'Archived' : 'Live'}</span>
              <h3>{e.title}</h3>
              <span>{fmtDate(e.date)} · {fmtPrice(e.price)}</span>
              <span>{e.seats - seatsLeft(e)} / {e.seats} booked</span>
            </div>
            <div className="adm-ev__actions">
              <button className="adm-btn" onClick={() => setEdit({ ...e, agenda: e.agenda || [] })}>Edit</button>
              <button className="adm-btn adm-btn--ghost" onClick={() => confirm(`Delete “${e.title}”?`) && deleteEvent(e.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {edit && (
          <Drawer title={edit.id ? 'Edit event' : 'New event'} onClose={() => setEdit(null)}>
            <EventForm initial={edit} onSave={(ev) => { saveEvent(ev); setEdit(null) }} />
          </Drawer>
        )}
      </AnimatePresence>
    </>
  )
}

function EventForm({ initial, onSave }) {
  const [f, setF] = useState(initial)
  const [warn, setWarn] = useState('')
  const set = (k, num) => (e) => setF({ ...f, [k]: num ? Number(e.target.value) : e.target.value })
  const upload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1.5e6) return setWarn('Please use an image under 1.5 MB.')
    const r = new FileReader()
    r.onload = () => { setF((x) => ({ ...x, poster: r.result })); setWarn('') }
    r.readAsDataURL(file)
  }
  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSave({ ...f, id: f.id || slugify(f.title) + '-' + f.date.slice(0, 4) })
      }}
    >
      <div className="adm-form__preview"><EventPoster event={f.title ? f : { ...f, title: 'Event title' }} /></div>
      <Field label="Title"><input required value={f.title} onChange={set('title')} /></Field>
      <Field label="Kicker (short line)"><input value={f.kicker} onChange={set('kicker')} placeholder="e.g. Inter-school debate league" /></Field>
      <div className="adm-row">
        <Field label="Date"><input required type="date" value={f.date} onChange={set('date')} /></Field>
        <Field label="Time"><input type="time" value={f.time} onChange={set('time')} /></Field>
      </div>
      <Field label="Venue"><input required value={f.venue} onChange={set('venue')} /></Field>
      <div className="adm-row">
        <Field label="Price (₹, 0 = free)"><input type="number" min="0" value={f.price} onChange={set('price', true)} /></Field>
        <Field label="Seats"><input type="number" min="1" value={f.seats} onChange={set('seats', true)} /></Field>
      </div>
      <Field label="Poster style">
        <div className="adm-swatches">
          {['amber', 'black', 'paper'].map((t) => (
            <button type="button" key={t} className={`adm-swatch adm-swatch--${t} ${f.theme === t ? 'is-on' : ''}`} onClick={() => setF({ ...f, theme: t })} aria-label={t} />
          ))}
          <label className="adm-upload">
            {f.poster ? 'Replace image' : 'Upload poster'}
            <input type="file" accept="image/*" onChange={upload} hidden />
          </label>
          {f.poster && <button type="button" className="adm-link" onClick={() => setF({ ...f, poster: '' })}>Remove image</button>}
        </div>
        {warn && <span className="login__err">{warn}</span>}
      </Field>
      <Field label="Description"><textarea rows="4" value={f.description} onChange={set('description')} /></Field>
      <Field label="Running order (one per line)">
        <textarea rows="4" value={f.agenda.join('\n')} onChange={(e) => setF({ ...f, agenda: e.target.value.split('\n').filter(Boolean) })} />
      </Field>
      <button className="adm-btn adm-btn--amber adm-btn--wide">Save & publish</button>
    </form>
  )
}

const blankPost = () => ({ id: '', title: '', category: 'Confidence', date: new Date().toISOString().slice(0, 10), read: 4, author: 'Ananya Rao', theme: 'amber', published: false, excerpt: '', body: [] })

function PostsAdmin() {
  const { posts, savePost, deletePost } = useStore()
  const [edit, setEdit] = useState(null)
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <div className="adm-bar">
        <p className="adm-note">Drafts stay hidden until you switch them to <strong>Published</strong>.</p>
        <button className="adm-btn adm-btn--amber" onClick={() => setEdit(blankPost())}>+ New post</button>
      </div>
      <table className="adm-table">
        <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th /></tr></thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.id}>
              <td data-l="Title"><strong>{p.title}</strong></td>
              <td data-l="Category">{p.category}</td>
              <td data-l="Date">{fmtDate(p.date)}</td>
              <td data-l="Status">
                <button className={`adm-tag ${p.published ? 'adm-tag--live' : ''}`} onClick={() => savePost({ ...p, published: !p.published })}>
                  {p.published ? 'Published' : 'Draft'}
                </button>
              </td>
              <td className="adm-table__actions">
                <button className="adm-btn" onClick={() => setEdit(p)}>Edit</button>
                <button className="adm-btn adm-btn--ghost" onClick={() => confirm(`Delete “${p.title}”?`) && deletePost(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AnimatePresence>
        {edit && (
          <Drawer title={edit.id ? 'Edit post' : 'New post'} onClose={() => setEdit(null)}>
            <PostForm initial={edit} onSave={(p) => { savePost(p); setEdit(null) }} />
          </Drawer>
        )}
      </AnimatePresence>
    </>
  )
}

function PostForm({ initial, onSave }) {
  const [f, setF] = useState({ ...initial, bodyText: initial.body.join('\n\n') })
  const set = (k, num) => (e) => setF({ ...f, [k]: num ? Number(e.target.value) : e.target.value })
  return (
    <form
      className="adm-form"
      onSubmit={(e) => {
        e.preventDefault()
        const { bodyText, ...rest } = f
        const body = bodyText.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)
        onSave({ ...rest, body, id: f.id || slugify(f.title), read: Math.max(1, Math.round(bodyText.split(/\s+/).length / 200)) })
      }}
    >
      <Field label="Title"><input required value={f.title} onChange={set('title')} /></Field>
      <div className="adm-row">
        <Field label="Category">
          <select value={f.category} onChange={set('category')}>
            {['Confidence', 'Technique', 'Parents', 'Corporate', 'News'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Date"><input type="date" value={f.date} onChange={set('date')} /></Field>
      </div>
      <div className="adm-row">
        <Field label="Author"><input value={f.author} onChange={set('author')} /></Field>
        <Field label="Cover">
          <div className="adm-swatches">
            {['amber', 'black', 'paper'].map((t) => (
              <button type="button" key={t} className={`adm-swatch adm-swatch--${t} ${f.theme === t ? 'is-on' : ''}`} onClick={() => setF({ ...f, theme: t })} aria-label={t} />
            ))}
          </div>
        </Field>
      </div>
      <Field label="Cover word (one short word)"><input value={f.glyph || ''} onChange={set('glyph')} placeholder="e.g. Pause." maxLength={8} /></Field>
      <Field label="Excerpt"><textarea rows="2" value={f.excerpt} onChange={set('excerpt')} /></Field>
      <Field label="Body (blank line between paragraphs)"><textarea rows="12" required value={f.bodyText} onChange={set('bodyText')} /></Field>
      <label className="adm-check">
        <input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} /> Published
      </label>
      <button className="adm-btn adm-btn--amber adm-btn--wide">Save post</button>
    </form>
  )
}

function RegsAdmin() {
  const { registrations, events } = useStore()
  const [ev, setEv] = useState('all')
  const list = useMemo(() => (ev === 'all' ? registrations : registrations.filter((r) => r.eventId === ev)), [registrations, ev])
  const exportCsv = () => {
    const head = ['Ref', 'Event', 'Name', 'Participant', 'Email', 'Phone', 'Seats', 'Amount', 'Payment', 'Date']
    const rows = list.map((r) => [r.id, r.eventTitle, r.name, r.attendee, r.email, r.phone, r.qty, r.amount, r.paymentId, r.createdAt])
    const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `miyagi-registrations-${ev}.csv`
    a.click()
  }
  return (
    <>
      <div className="adm-bar">
        <select className="adm-select" value={ev} onChange={(e) => setEv(e.target.value)}>
          <option value="all">All events</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <button className="adm-btn" onClick={exportCsv} disabled={!list.length}>Export CSV</button>
      </div>
      {list.length === 0 ? (
        <Empty text="No bookings yet. When someone books and pays for an event, they’ll appear here." />
      ) : (
        <table className="adm-table">
          <thead><tr><th>Ref</th><th>Event</th><th>Booked by</th><th>Contact</th><th>Seats</th><th>Paid</th><th>When</th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td data-l="Ref"><code>{r.id}</code></td>
                <td data-l="Event">{r.eventTitle}</td>
                <td data-l="Booked by"><strong>{r.name}</strong>{r.attendee && <><br /><small>for {r.attendee}</small></>}</td>
                <td data-l="Contact">{r.email}<br /><small>{r.phone}</small></td>
                <td data-l="Seats">{r.qty}</td>
                <td data-l="Paid">{fmtPrice(r.amount)}</td>
                <td data-l="When">{new Date(r.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

function LeadsAdmin() {
  const { leads } = useStore()
  if (!leads.length) return <Empty text="No enquiries yet. Program, corporate and contact form submissions land here." />
  return (
    <table className="adm-table">
      <thead><tr><th>Name</th><th>Interest</th><th>Contact</th><th>Message</th><th>When</th></tr></thead>
      <tbody>
        {leads.map((l) => (
          <tr key={l.id}>
            <td data-l="Name"><strong>{l.name}</strong>{l.company && <><br /><small>{l.company}</small></>}</td>
            <td data-l="Interest">{l.program}</td>
            <td data-l="Contact">{l.email}<br /><small>{l.phone}</small></td>
            <td data-l="Message">{l.message || '—'}</td>
            <td data-l="When">{new Date(l.createdAt).toLocaleDateString('en-IN')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Field = ({ label, children }) => (
  <label className="adm-field">
    <span>{label}</span>
    {children}
  </label>
)

const Empty = ({ text }) => (
  <div className="adm-empty">
    <Mascot ink="#fbb03b" band="#fff" />
    <p>{text}</p>
  </div>
)

function Drawer({ title, onClose, children }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])
  return (
    <motion.div className="co" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="co__scrim" onClick={onClose} />
      <motion.aside className="co__panel adm-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }} data-lenis-prevent>
        <div className="co__head">
          <span className="label">{title}</span>
          <button className="co__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </motion.aside>
    </motion.div>
  )
}
