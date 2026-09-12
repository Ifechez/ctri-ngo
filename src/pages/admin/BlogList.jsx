import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import client from '../../api/client'
import BlogForm from './BlogForm'

export default function BlogList() {
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  function load() {
    setLoading(true)
    client
      .get('/admin/blog-posts')
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleDelete(post) {
    if (!confirm(`Delete "${post.title}"?`)) return
    try {
      await client.delete(`/blog-posts/${post.id}`)
      toast.success('Post deleted.')
      load()
    } catch {
      toast.error('Could not delete this post.')
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Blog</h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">Write updates and stories for the public blog.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true) }}
          className="flex w-fit items-center gap-2 rounded-full bg-[var(--color-maroon)] px-5 py-2.5 text-sm font-medium text-[var(--color-cream)]"
        >
          <Plus size={16} /> New post
        </button>
      </div>

      {loading ? (
        <p className="mt-10 text-[var(--color-ink)]/50">Loading…</p>
      ) : data.data.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-ink)]/20 p-12 text-center text-[var(--color-ink)]/50">
          No posts yet. Write your first one.
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-ink)]/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-[var(--color-cream-dim)] text-left text-[var(--color-ink)]/60">
                <tr>
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Updated</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.data.map((post) => (
                  <tr key={post.id} className="border-t border-[var(--color-ink)]/10">
                    <td className="max-w-[220px] truncate px-5 py-3 font-medium">{post.title}</td>
                    <td className="px-5 py-3">
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-[var(--color-ink)]/10 text-[var(--color-ink)]/60'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-[var(--color-ink)]/60">{new Date(post.updated_at).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      <button onClick={() => { setEditing(post); setFormOpen(true) }} className="mr-2 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[var(--color-maroon)] hover:bg-[var(--color-cream-dim)]">
                        <Pencil size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(post)} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[var(--color-crimson)] hover:bg-[var(--color-cream-dim)]">
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formOpen && (
        <BlogForm post={editing} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); load() }} />
      )}
    </div>
  )
}