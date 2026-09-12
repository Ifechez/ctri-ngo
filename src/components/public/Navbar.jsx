import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { settings } = useSettings()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-ink)]/10 bg-[var(--color-cream)]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-maroon)] text-[var(--color-gold-light)]">
            C
          </span>
          <span className="hidden sm:inline">{settings.org_short_name}</span>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-[var(--color-crimson)]' : 'text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className="rounded-full bg-[var(--color-maroon)] px-5 py-2 text-sm font-medium text-[var(--color-cream)] transition-transform hover:scale-105"
          >
            Get Involved
          </NavLink>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--color-ink)]/10 bg-[var(--color-cream)] px-5 pb-5 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium ${isActive ? 'text-[var(--color-crimson)]' : 'text-[var(--color-ink)]/80'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
