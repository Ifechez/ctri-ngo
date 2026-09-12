import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, HandHeart, Users, BookOpen } from 'lucide-react'
import client from '../../api/client'
import { useSettings } from '../../context/SettingsContext'
import HeroGlobe from '../../components/three/HeroGlobe'
import Reveal from '../../components/public/Reveal'
import TiltCard from '../../components/public/TiltCard'
import RanksDivider from '../../components/public/RanksDivider'

export default function Home() {
  const { settings } = useSettings()
  const [projects, setProjects] = useState([])
  const [posts, setPosts] = useState([])
  const [team, setTeam] = useState([])

  useEffect(() => {
    client.get('/projects?status=ongoing').then((r) => setProjects(r.data.data?.slice(0, 3) ?? []))
    client.get('/blog-posts').then((r) => setPosts(r.data.data?.slice(0, 3) ?? []))
    client.get('/team-members').then((r) => setTeam(r.data?.slice(0, 4) ?? []))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-ink)]">
        <HeroGlobe />
        <div className="relative z-10 mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-center px-5 py-24 text-[var(--color-cream)]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-sm uppercase tracking-[0.3em] text-[var(--color-gold-light)]"
          >
            {settings.org_short_name} · Chanchaga, Minna
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.08] sm:text-6xl"
          >
            {settings.hero_headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg text-[var(--color-cream)]/75"
          >
            {settings.hero_subheadline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              to="/projects"
              className="flex items-center gap-2 rounded-full bg-[var(--color-crimson)] px-6 py-3 text-sm font-medium transition-transform hover:scale-105"
            >
              See our projects <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 rounded-full border border-[var(--color-cream)]/30 px-6 py-3 text-sm font-medium hover:bg-[var(--color-cream)]/10"
            >
              Partner with us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center">
        <Reveal>
          <RanksDivider className="mx-auto justify-center" />
          <h2 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">Our Mission</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/70">
            {settings.org_mission}
          </p>
        </Reveal>
      </section>

      {/* Pillars */}
      <section className="bg-[var(--color-cream-dim)] py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:grid-cols-3">
          {[
            { icon: HandHeart, title: 'Community Support', text: 'Direct outreach and relief for the most vulnerable across Niger State.' },
            { icon: BookOpen, title: 'Education', text: 'Scholarships, mentorship and learning resources for underserved youth.' },
            { icon: Users, title: 'Empowerment', text: 'Skills training and livelihood support that helps families stand on their own.' },
          ].map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.1}>
              <TiltCard className="h-full rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-cream)] p-8">
                <pillar.icon className="text-[var(--color-crimson)]" size={28} />
                <h3 className="mt-4 font-display text-xl font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]/65">{pillar.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-24">
          <Reveal className="flex items-end justify-between">
            <div>
              <p className="font-display text-sm uppercase tracking-[0.25em] text-[var(--color-crimson)]">Active Work</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Ongoing Projects</h2>
            </div>
            <Link to="/projects" className="hidden items-center gap-1 text-sm font-medium text-[var(--color-maroon)] sm:flex">
              View all <ArrowRight size={14} />
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
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
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Team teaser */}
      {team.length > 0 && (
        <section className="bg-[var(--color-maroon)] py-24 text-[var(--color-cream)]">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal className="text-center">
              <p className="font-display text-sm uppercase tracking-[0.25em] text-[var(--color-gold-light)]">The People</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Meet the Team</h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-4">
              {team.map((member, i) => (
                <Reveal key={member.id} delay={i * 0.08} className="text-center">
                  <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-cream)]/10">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-2xl">
                        {member.name?.[0]}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold">{member.name}</h3>
                  <p className="text-xs text-[var(--color-cream)]/60">{member.role}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-10 text-center">
              <Link to="/about" className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-gold-light)]">
                Meet the full team <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Blog teaser */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-24">
          <Reveal className="flex items-end justify-between">
            <div>
              <p className="font-display text-sm uppercase tracking-[0.25em] text-[var(--color-crimson)]">Stories</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Latest Updates</h2>
            </div>
            <Link to="/blog" className="hidden items-center gap-1 text-sm font-medium text-[var(--color-maroon)] sm:flex">
              Read the blog <ArrowRight size={14} />
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.08}>
                <Link to={`/blog/${post.slug}`} className="block overflow-hidden rounded-2xl border border-[var(--color-ink)]/10">
                  <div className="aspect-[4/3] overflow-hidden bg-[var(--color-cream-dim)]">
                    {post.cover_image_url && (
                      <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{post.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-ink)]/60 line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
