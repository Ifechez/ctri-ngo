import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Newspaper, FolderKanban, Settings, Mail, LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/team', label: 'Team', icon: Users },
  { to: '/admin/blog', label: 'Blog', icon: Newspaper },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-cream-dim)]">
      <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--color-ink)]/10 bg-[var(--color-ink)] text-[var(--color-cream)]">
        <div className="flex items-center gap-2.5 px-6 py-6 font-display text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-gold)] text-[var(--color-ink)]">C</span>
          C.T.R.I Admin
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-[var(--color-maroon)] text-[var(--color-cream)]' : 'text-[var(--color-cream)]/65 hover:bg-[var(--color-cream)]/5'
                }`
              }
            >
              <link.icon size={17} /> {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-[var(--color-cream)]/10 p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-cream)]/65 hover:bg-[var(--color-cream)]/5"
          >
            <ExternalLink size={17} /> View site
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-cream)]/65 hover:bg-[var(--color-cream)]/5"
          >
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-end border-b border-[var(--color-ink)]/10 bg-[var(--color-cream)] px-8 py-4">
          <span className="text-sm text-[var(--color-ink)]/60">Signed in as <strong>{user?.name}</strong></span>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
