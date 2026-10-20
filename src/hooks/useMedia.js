import { useEffect, useState } from 'react'

export default function useMedia(query) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/* First paint sits behind the preloader; later navigations behind the curtain. */
const BOOT = performance.now()
export const introDelay = () => (performance.now() - BOOT < 2600 ? 2.45 : 0.7)
