import { useEffect, useState } from 'react'
import { Users, Newspaper, FolderKanban, Mail } from 'lucide-react'
import client from '../../api/client'

export default function DashboardHome() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    client.get('/dashboard/stats').then((r) => setStats(r.data))
  }, [])

  const cards = [
    { label: 'Team Members', value: stats?.team_members, icon: Users },
    { label: 'Blog Posts', value: stats?.blog_posts, sub: `${stats?.published_blog_posts ?? 0} published`, icon: Newspaper },
    { label: 'Projects', value: stats?.projects, sub: `${stats?.ongoing_projects ?? 0} ongoing`, icon: FolderKanban },
    { label: 'Messages', value: stats?.total_messages, sub: `${stats?.unread_messages ?? 0} unread`, icon: Mail },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--color-ink)]/60">Overview of your NGO website content.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-[var(--color-ink)]/10 bg-white p-5 sm:p-6">
            <card.icon className="text-[var(--color-maroon)]" size={22} />
            <p className="mt-4 font-display text-3xl font-semibold">{card.value ?? '—'}</p>
            <p className="mt-1 text-sm text-[var(--color-ink)]/60">{card.label}</p>
            {card.sub && <p className="mt-0.5 text-xs text-[var(--color-crimson)]">{card.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}