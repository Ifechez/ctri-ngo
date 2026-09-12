import { useState } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import client from '../../api/client'
import { toFormData } from '../../lib/formData'

export default function TeamMemberForm({ member, onClose, onSaved }) {
  const isEdit = Boolean(member)
  const [form, setForm] = useState({
    name: member?.name || '',
    role: member?.role || '',
    bio: member?.bio || '',
    email: member?.email || '',
    phone: member?.phone || '',
    display_order: member?.display_order ?? 0,
    is_published: member?.is_published ?? true,
  })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(member?.photo_url || null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    const payload = { ...form, photo }

    try {
      if (isEdit) {
        // Laravel needs POST + _method=PUT for multipart file uploads
        await client.post(`/team-members/${member.id}`, toFormData(payload, { method: 'PUT' }), {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast.success('Team member updated.')
      } else {
        await client.post('/team-members', toFormData(payload), {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast.success('Team member added.')
      }
      onSaved()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        toast.error('Could not save this team member.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 px-0" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-md overflow-y-auto bg-[var(--color-cream)] p-5 shadow-2xl sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">{isEdit ? 'Edit Team Member' : 'Add Team Member'}</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[var(--color-cream-dim)]">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[var(--color-ink)]/40">No photo</div>
              )}
            </div>
            <div>
              <label className="cursor-pointer rounded-lg border border-[var(--color-ink)]/15 px-3 py-2 text-sm font-medium hover:bg-[var(--color-cream-dim)]">
                Upload photo
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              {errors.photo && <p className="mt-1 text-xs text-[var(--color-crimson)]">{errors.photo[0]}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-[var(--color-crimson)]">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Role / Title</label>
            <input
              required
              placeholder="e.g. Chairman, Secretary, Board Member"
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
            />
            {errors.role && <p className="mt-1 text-xs text-[var(--color-crimson)]">{errors.role[0]}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Short bio</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => update('bio', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Display order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => update('display_order', Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
              />
            </div>
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => update('is_published', e.target.checked)}
                />
                Visible on site
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-[var(--color-ink)]/10 pt-5 sm:flex-row">
            <button type="button" onClick={onClose} className="rounded-full px-5 py-2.5 text-sm font-medium text-[var(--color-ink)]/60">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[var(--color-maroon)] px-6 py-2.5 text-sm font-medium text-[var(--color-cream)] disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}