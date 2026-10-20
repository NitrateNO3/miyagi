import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedEvents, seedPosts } from '../data/content'

const KEY = 'miyagi-store-v1'
const StoreCtx = createContext(null)

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { events: seedEvents, posts: seedPosts, registrations: [], leads: [] }
}

export const todayISO = () => new Date().toISOString().slice(0, 10)
export const isPast = (e) => e.date < todayISO()

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  }, [state])

  const upsert = (list, item) =>
    list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list]

  const actions = useMemo(
    () => ({
      saveEvent: (ev) => setState((s) => ({ ...s, events: upsert(s.events, ev) })),
      deleteEvent: (id) => setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) })),
      savePost: (p) => setState((s) => ({ ...s, posts: upsert(s.posts, p) })),
      deletePost: (id) => setState((s) => ({ ...s, posts: s.posts.filter((p) => p.id !== id) })),
      addRegistration: (r) => setState((s) => ({ ...s, registrations: [r, ...s.registrations] })),
      addLead: (l) => setState((s) => ({ ...s, leads: [l, ...s.leads] })),
      reset: () => setState({ events: seedEvents, posts: seedPosts, registrations: [], leads: [] }),
    }),
    []
  )

  const value = useMemo(() => {
    const sorted = [...state.events].sort((a, b) => a.date.localeCompare(b.date))
    return {
      ...state,
      upcoming: sorted.filter((e) => !isPast(e)),
      past: sorted.filter(isPast).reverse(),
      publishedPosts: [...state.posts].filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date)),
      seatsLeft: (ev) =>
        Math.max(0, ev.seats - state.registrations.filter((r) => r.eventId === ev.id).reduce((n, r) => n + r.qty, 0)),
      ...actions,
    }
  }, [state, actions])

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export const useStore = () => useContext(StoreCtx)

export const slugify = (s) =>
  s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const fmtDate = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', opts)

export const fmtPrice = (n) => (n === 0 ? 'Free' : '₹' + n.toLocaleString('en-IN'))

export const useNow = () => {
  const [, set] = useState(0)
  const tick = useCallback(() => set((n) => n + 1), [])
  useEffect(() => {
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [tick])
}
