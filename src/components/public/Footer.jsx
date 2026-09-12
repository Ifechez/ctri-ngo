import { NavLink } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="mt-24 border-t border-[var(--color-cream-dim)] bg-[var(--color-ink)] text-[var(--color-cream)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-gold)] text-[var(--color-ink)]">
              C
            </span>
            {settings.org_short_name}
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-cream)]/70">
            {settings.org_tagline}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--color-gold-light)]">
            Explore
          </h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-[var(--color-cream)]/70">
            <NavLink to="/about" className="hover:text-[var(--color-cream)]">About Us</NavLink>
            <NavLink to="/projects" className="hover:text-[var(--color-cream)]">Our Projects</NavLink>
            <NavLink to="/blog" className="hover:text-[var(--color-cream)]">Blog & Updates</NavLink>
            <NavLink to="/contact" className="hover:text-[var(--color-cream)]">Contact</NavLink>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--color-gold-light)]">
            Reach Us
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-[var(--color-cream)]/70">
            {settings.org_email && (
              <a href={`mailto:${settings.org_email}`} className="flex items-center gap-2 hover:text-[var(--color-cream)]">
                <Mail size={16} /> {settings.org_email}
              </a>
            )}
            {settings.org_phone && (
              <a href={`tel:${settings.org_phone}`} className="flex items-center gap-2 hover:text-[var(--color-cream)]">
                <Phone size={16} /> {settings.org_phone}
              </a>
            )}
            {settings.org_address && (
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" /> {settings.org_address}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-cream)]/10 px-5 py-5 text-center text-xs text-[var(--color-cream)]/50">
        © {new Date().getFullYear()} {settings.org_name}. All rights reserved.
      </div>
    </footer>
  )
}
