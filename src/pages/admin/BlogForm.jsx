import { useState } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import client from '../../api/client'
import { toFormData } from '../../lib/formData'

export default function BlogForm({ post, onClose, onSaved }) {
  const isEdit = Boolean(post)
  const [form, setForm] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author_name: post?.author_name || '',
    status: post?.status || 'draft',
  })
  const [cover, setCover] = useState(null)
  const [preview, setPreview] = useState(post?.cover_image_url || null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleCoverChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setCover(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    const payload = { ...form, cover_image: cover }

    try {
      if (isEdit) {
        await client.post(`/blog-posts/${post.id}`, toFormData(payload, { method: 'PUT' }), {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast.success('Post updated.')
      } else {
        await client.post('/blog-posts', toFormData(payload), {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        toast.success('Post created.')
      }
      onSaved()
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        toast.error('Could not save this post.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[var(--color-cream)] p-5 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">{isEdit ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
            />
            {errors.title && <p className="mt-1 text-xs text-[var(--color-crimson)]">{errors.title[0]}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Cover image</label>
            <div className="mt-1 flex flex-wrap items-center gap-4">
              {preview && <img src={preview} alt="Cover preview" className="h-16 w-24 rounded-lg object-cover" />}
              <label className="cursor-pointer rounded-lg border border-[var(--color-ink)]/15 px-3 py-2 text-sm font-medium hover:bg-[var(--color-cream-dim)]">
                Upload image
                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Excerpt</label>
            <textarea
              rows={2}
              maxLength={500}
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea
              required
              rows={10}
              value={form.content}
              onChange={(e) => update('content', e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
            />
            {errors.content && <p className="mt-1 text-xs text-[var(--color-crimson)]">{errors.content[0]}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Author name</label>
              <input
                value={form.author_name}
                onChange={(e) => update('author_name', e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
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
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}