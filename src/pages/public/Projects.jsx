import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../../api/client'
import Reveal from '../../components/public/Reveal'
import TiltCard from '../../components/public/TiltCard'
import RanksDivider from '../../components/public/RanksDivider'

const statuses = [
  { value: '', label: 'All' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'upcoming', label: 'Upcoming' },
]

export default function Projects() {
  const [status, setStatus] = useState('')
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    client
      .get(`/projects${status ? `?status=${status}` : ''}`)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }, [status])

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <Reveal className="text-center">
        <RanksDivider className="mx-auto justify-center" />
        <h1 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">Our Projects</h1>
        <p className="mx-auto mt-3 max-w-lg text-[var(--color-ink)]/60">
          Programmes closing the gap between communities and the support they need.
        </p>
      </Reveal>

      <div className="mt-10 flex justify-center gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              status === s.value ? 'bg-[var(--color-maroon)] text-[var(--color-cream)]' : 'bg-[var(--color-cream-dim)] text-[var(--color-ink)]/70'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {!loading && data.data.length === 0 && (
        <p className="mt-16 text-center text-[var(--color-ink)]/50">No projects in this category yet.</p>
      )}

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.08}>
            <TiltCard>
              <Link to={`/projects/${p.slug}`} className="block overflow-hidden rounded-2xl border border-[var(--color-ink)]/10 bg-white">
                <div className="aspect-[4/3] overflow-hidden bg-[var(--color-cream-dim)]">
                  {p.cover_image_url ? (
                    <img src={p.cover_image_url} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--color-ink)]/30">{p.title}</div>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-crimson)]">{p.status}</span>
                  <h3 className="mt-1 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-[var(--color-ink)]/60 line-clamp-2">{p.summary}</p>
                  {p.location && <p className="mt-2 text-xs text-[var(--color-ink)]/45">{p.location}</p>}
                </div>
              </Link>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
