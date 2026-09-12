import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ImageOff } from 'lucide-react'
import toast from 'react-hot-toast'
import client from '../../api/client'
import ProjectForm from './ProjectForm'

function CoverImage({ src, alt }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[var(--color-ink)]/30">
        <ImageOff size={28} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}

export default function ProjectsList() {
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  function load() {
    setLoading(true)
    client
      .get('/projects')
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleDelete(project) {
    if (!confirm(`Delete "${project.title}"?`)) return
    try {
      await client.delete(`/projects/${project.id}`)
      toast.success('Project deleted.')
      load()
    } catch {
      toast.error('Could not delete this project.')
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">Manage the programmes shown on the public Projects page.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true) }}
          className="flex w-fit items-center gap-2 rounded-full bg-[var(--color-maroon)] px-5 py-2.5 text-sm font-medium text-[var(--color-cream)]"
        >
          <Plus size={16} /> New project
        </button>
      </div>

      {loading ? (
        <p className="mt-10 text-[var(--color-ink)]/50">Loading…</p>
      ) : data.data.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-ink)]/20 p-12 text-center text-[var(--color-ink)]/50">
          No projects yet. Add your first one.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((project) => (
            <div key={project.id} className="overflow-hidden rounded-2xl border border-[var(--color-ink)]/10 bg-white">
              <div className="aspect-[16/9] bg-[var(--color-cream-dim)]">
                <CoverImage src={project.cover_image_url} alt={project.title} />
              </div>
              <div className="p-5">
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-crimson)]">{project.status}</span>
                <p className="mt-1 truncate font-display font-semibold">{project.title}</p>
                {!project.is_published && (
                  <span className="mt-1 inline-block rounded-full bg-[var(--color-ink)]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink)]/50">
                    Hidden
                  </span>
                )}
                <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-[var(--color-ink)]/10 pt-3">
                  <button onClick={() => { setEditing(project); setFormOpen(true) }} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-maroon)] hover:bg-[var(--color-cream-dim)]">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(project)} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-crimson)] hover:bg-[var(--color-cream-dim)]">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <ProjectForm project={editing} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); load() }} />
      )}
    </div>
  )
}