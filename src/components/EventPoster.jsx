import { Mascot, Star } from './ui'
import { fmtDate, fmtPrice } from '../store/Store'

/*
  Typographic event poster, generated from event data so every event the
  team publishes in /admin looks designed. An uploaded image overrides it.
*/
export default function EventPoster({ event, past = false, className = '' }) {
  const d = new Date(event.date + 'T00:00:00')
  const day = d.getDate()
  const month = d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()
  const theme = event.theme || 'amber'

  if (event.poster) {
    return (
      <div className={`poster poster--image ${className}`}>
        <img src={event.poster} alt={event.title} loading="lazy" />
        {past && <span className="poster__stamp">Concluded</span>}
      </div>
    )
  }

  return (
    <div className={`poster poster--${theme} ${past ? 'is-past' : ''} ${className}`}>
      <div className="poster__grain" />
      <div className="poster__top">
        <span>Miyagi presents</span>
        <span>{d.getFullYear()}</span>
      </div>
      <div className="poster__date">
        <span className="poster__day">{String(day).padStart(2, '0')}</span>
        <span className="poster__month">{month}</span>
      </div>
      <Mascot className="poster__mascot" ink={theme === 'black' ? '#fbb03b' : '#000'} band={theme === 'amber' ? '#fff' : theme === 'black' ? '#fff' : '#fbb03b'} />
      <div className="poster__title">{event.title}</div>
      <div className="poster__bottom">
        <span>{event.kicker}</span>
        <Star />
        <span>{fmtPrice(event.price)}</span>
      </div>
      {past && <span className="poster__stamp">Concluded · {fmtDate(event.date, { month: 'short', year: 'numeric' })}</span>}
    </div>
  )
}
