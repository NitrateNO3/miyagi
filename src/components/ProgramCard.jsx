import { Link } from 'react-router-dom'
import { Arrow } from './ui'
import ProgramIcon from './ProgramIcon'
import { programs } from '../data/programs'

export default function ProgramCard({ program, className = '' }) {
  const index = programs.findIndex((p) => p.slug === program.slug) + 1
  return (
    <Link to={`/programs/${program.slug}`} className={`pcard ${className}`} data-cursor="Explore" style={{ '--tone': program.tone, '--len': program.short.length }}>
      <div className="pcard__top">
        <span className="num">No. {String(index).padStart(2, '0')}</span>
        <span className="pcard__audience">{program.audiences.map((a) => a[0].toUpperCase() + a.slice(1)).join(' · ')}</span>
      </div>
      <div className="pcard__art" aria-hidden>
        <ProgramIcon slug={program.slug} />
      </div>
      <div className="pcard__body">
        <h3 className="pcard__title">{program.title}</h3>
        <p className="pcard__tag">{program.tagline}</p>
        <div className="pcard__meta">
          <span>{program.ages}</span>
          <span>{program.duration}</span>
          <span className="pcard__go"><Arrow /></span>
        </div>
      </div>
    </Link>
  )
}
