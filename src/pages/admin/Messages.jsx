import { useEffect, useState } from 'react'
import { Trash2, Mail, MailOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import client from '../../api/client'

export default function Messages() {
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    client
      .get('/contact-messages')
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function toggleRead(msg) {
    await client.put(`/contact-messages/${msg.id}`, { is_read: !msg.is_read })
    load()
  }

  async function handleDelete(msg) {
    if (!confirm('Delete this message?')) return
    try {
      await client.delete(`/contact-messages/${msg.id}`)
      toast.success('Message deleted.')
      load()
    } catch {
      toast.error('Could not delete this message.')
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Messages</h1>
      <p className="mt-1 text-sm text-[var(--color-ink)]/60">Submissions from the public contact form.</p>

      {loading ? (
        <p className="mt-10 text-[var(--color-ink)]/50">Loading…</p>
      ) : data.data.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-ink)]/20 p-12 text-center text-[var(--color-ink)]/50">
          No messages yet.
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {data.data.map((msg) => (
            <div key={msg.id} className={`rounded-2xl border p-4 sm:p-5 ${msg.is_read ? 'border-[var(--color-ink)]/10 bg-white' : 'border-[var(--color-maroon)]/30 bg-[var(--color-gold)]/10'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words font-display font-semibold">{msg.subject || '(No subject)'}</p>
                  <p className="break-words text-sm text-[var(--color-ink)]/60">{msg.name} · {msg.email}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => toggleRead(msg)} className="rounded-lg p-2 text-[var(--color-maroon)] hover:bg-[var(--color-cream-dim)]" title={msg.is_read ? 'Mark unread' : 'Mark read'}>
                    {msg.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
                  </button>
                  <button onClick={() => handleDelete(msg)} className="rounded-lg p-2 text-[var(--color-crimson)] hover:bg-[var(--color-cream-dim)]" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm text-[var(--color-ink)]/75">{msg.message}</p>
              <p className="mt-2 text-xs text-[var(--color-ink)]/40">{new Date(msg.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}