import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import client from '../../api/client'
import Reveal from '../../components/public/Reveal'
import RanksDivider from '../../components/public/RanksDivider'

export default function Blog() {
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') || 1)
  const [data, setData] = useState({ data: [], last_page: 1 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    client
      .get(`/blog-posts?page=${page}`)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <Reveal className="text-center">
        <RanksDivider className="mx-auto justify-center" />
        <h1 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">Blog & Updates</h1>
        <p className="mx-auto mt-3 max-w-lg text-[var(--color-ink)]/60">
          News, stories and reflections from our work across Niger State.
        </p>
      </Reveal>

      {!loading && data.data.length === 0 && (
        <p className="mt-16 text-center text-[var(--color-ink)]/50">No posts published yet — check back soon.</p>
      )}

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((post, i) => (
          <Reveal key={post.id} delay={(i % 3) * 0.08}>
            <Link to={`/blog/${post.slug}`} className="group block overflow-hidden rounded-2xl border border-[var(--color-ink)]/10 bg-white">
              <div className="aspect-[4/3] overflow-hidden bg-[var(--color-cream-dim)]">
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--color-ink)]/30">{post.title}</div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-crimson)]">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold">{post.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-ink)]/60 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {data.last_page > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: data.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setParams({ page: String(p) })}
              className={`h-9 w-9 rounded-full text-sm font-medium ${
                p === page ? 'bg-[var(--color-maroon)] text-[var(--color-cream)]' : 'bg-[var(--color-cream-dim)] text-[var(--color-ink)]/70'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
