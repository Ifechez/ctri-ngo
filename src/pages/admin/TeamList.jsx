import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import client from '../../api/client'
import TeamMemberForm from './TeamMemberForm'

export default function TeamList() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  function load() {
    setLoading(true)
    client
      .get('/team-members')
      .then((r) => setMembers(r.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(member) {
    setEditing(member)
    setFormOpen(true)
  }

  async function handleDelete(member) {
    if (!confirm(`Remove ${member.name} from the team?`)) return
    try {
      await client.delete(`/team-members/${member.id}`)
      toast.success('Team member removed.')
      load()
    } catch {
      toast.error('Could not remove this team member.')
    }
  }

  function handleSaved() {
    setFormOpen(false)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Team</h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            Add, edit or remove team members. Changes appear on the public About page immediately.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-full bg-[var(--color-maroon)] px-5 py-2.5 text-sm font-medium text-[var(--color-cream)]"
        >
          <Plus size={16} /> Add team member
        </button>
      </div>

      {loading ? (
        <p className="mt-10 text-[var(--color-ink)]/50">Loading…</p>
      ) : members.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-ink)]/20 p-12 text-center text-[var(--color-ink)]/50">
          No team members yet. Add your first one.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={member.id} className="rounded-2xl border border-[var(--color-ink)]/10 bg-white p-5">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[var(--color-cream-dim)]">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-xl text-[var(--color-maroon)]">
                      {member.name?.[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold">{member.name}</p>
                  <p className="truncate text-sm text-[var(--color-crimson)]">{member.role}</p>
                  {!member.is_published && (
                    <span className="mt-1 inline-block rounded-full bg-[var(--color-ink)]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-ink)]/50">
                      Hidden
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t border-[var(--color-ink)]/10 pt-3">
                <button
                  onClick={() => openEdit(member)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-maroon)] hover:bg-[var(--color-cream-dim)]"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(member)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-crimson)] hover:bg-[var(--color-cream-dim)]"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <TeamMemberForm member={editing} onClose={() => setFormOpen(false)} onSaved={handleSaved} />
      )}
    </div>
  )
}
