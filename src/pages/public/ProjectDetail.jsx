import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, Calendar } from 'lucide-react'
import client from '../../api/client'
import Reveal from '../../components/public/Reveal'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setProject(null)
    setNotFound(false)
    client
      .get(`/projects/${slug}`)
      .then((r) => setProject(r.data))
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold">Project not found</h1>
        <Link to="/projects" className="mt-4 inline-block text-[var(--color-maroon)]">Back to projects</Link>
      </div>
    )
  }

  if (!project) return <div className="mx-auto max-w-2xl px-5 py-32 text-center text-[var(--color-ink)]/50">Loading…</div>

  return (
    <article className="mx-auto max-w-3xl px-5 py-20">
      <Reveal>
        <Link to="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-maroon)]">
          <ArrowLeft size={14} /> Back to projects
        </Link>
        <span className="mt-6 inline-block rounded-full bg-[var(--color-crimson)]/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--color-crimson)]">
          {project.status}
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{project.title}</h1>

        <div className="mt-4 flex flex-wrap gap-5 text-sm text-[var(--color-ink)]/60">
          {project.location && (
            <span className="flex items-center gap-1.5"><MapPin size={15} /> {project.location}</span>
          )}
          {project.beneficiaries && (
            <span className="flex items-center gap-1.5"><Users size={15} /> {project.beneficiaries.toLocaleString()} beneficiaries</span>
          )}
          {project.start_date && (
            <span className="flex items-center gap-1.5">
              <Calendar size={15} />
              {new Date(project.start_date).toLocaleDateString()}
              {project.end_date ? ` – ${new Date(project.end_date).toLocaleDateString()}` : ''}
            </span>
          )}
        </div>

        {project.cover_image_url && (
          <img src={project.cover_image_url} alt={project.title} className="mt-8 w-full rounded-2xl object-cover" />
        )}

        {project.summary && <p className="mt-8 text-lg leading-relaxed text-[var(--color-ink)]/75">{project.summary}</p>}
        {project.description && (
          <div className="prose prose-lg mt-6 max-w-none whitespace-pre-wrap leading-relaxed text-[var(--color-ink)]/75">
            {project.description}
          </div>
        )}
      </Reveal>
    </article>
  )
}
