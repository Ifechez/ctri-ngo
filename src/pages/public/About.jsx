import { useEffect, useState } from 'react'
import client from '../../api/client'
import { useSettings } from '../../context/SettingsContext'
import Reveal from '../../components/public/Reveal'
import TiltCard from '../../components/public/TiltCard'
import RanksDivider from '../../components/public/RanksDivider'
import { Mail, Phone } from 'lucide-react'

export default function About() {
  const { settings } = useSettings()
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .get('/team-members')
      .then((r) => setTeam(r.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="bg-[var(--color-ink)] py-24 text-[var(--color-cream)]">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-[var(--color-gold-light)]">About Us</p>
            <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">{settings.org_name}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-cream)]/70">{settings.org_mission}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-5 py-20 sm:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-cream-dim)] p-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-maroon)]">Our Mission</h2>
            <p className="mt-3 leading-relaxed text-[var(--color-ink)]/70">{settings.org_mission}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="h-full rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-cream-dim)] p-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-maroon)]">Our Vision</h2>
            <p className="mt-3 leading-relaxed text-[var(--color-ink)]/70">
              {settings.org_vision || 'A future where every community has the support it needs to thrive.'}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal className="text-center">
          <RanksDivider className="mx-auto justify-center" />
          <h2 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">Our Team</h2>
          <p className="mx-auto mt-3 max-w-lg text-[var(--color-ink)]/60">
            The people closing the ranks — leadership and volunteers driving our work forward.
          </p>
        </Reveal>

        {!loading && team.length === 0 && (
          <p className="mt-10 text-center text-[var(--color-ink)]/50">Team profiles coming soon.</p>
        )}

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={(i % 3) * 0.08}>
              <TiltCard className="h-full rounded-2xl border border-[var(--color-ink)]/10 bg-white p-6 text-center">
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-cream-dim)]">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-3xl text-[var(--color-maroon)]">
                      {member.name?.[0]}
                    </div>
                  )}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{member.name}</h3>
                <p className="text-sm font-medium text-[var(--color-crimson)]">{member.role}</p>
                {member.bio && <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]/60">{member.bio}</p>}
                <div className="mt-4 flex justify-center gap-4 text-[var(--color-ink)]/50">
                  {member.email && (
                    <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="hover:text-[var(--color-maroon)]">
                      <Mail size={16} />
                    </a>
                  )}
                  {member.phone && (
                    <a href={`tel:${member.phone}`} aria-label={`Call ${member.name}`} className="hover:text-[var(--color-maroon)]">
                      <Phone size={16} />
                    </a>
                  )}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
