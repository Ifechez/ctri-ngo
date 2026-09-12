import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import client from '../../api/client'

const fields = [
  { key: 'org_name', label: 'Organisation name' },
  { key: 'org_short_name', label: 'Short name (nav/footer)' },
  { key: 'org_tagline', label: 'Tagline' },
  { key: 'org_mission', label: 'Mission statement', textarea: true },
  { key: 'org_vision', label: 'Vision statement', textarea: true },
  { key: 'hero_headline', label: 'Homepage hero headline' },
  { key: 'hero_subheadline', label: 'Homepage hero sub-headline', textarea: true },
  { key: 'org_email', label: 'Contact email' },
  { key: 'org_phone', label: 'Primary phone' },
  { key: 'org_phone_alt', label: 'Alternate phone' },
  { key: 'org_address', label: 'Address' },
  { key: 'org_facebook', label: 'Facebook URL' },
  { key: 'org_twitter', label: 'Twitter / X URL' },
  { key: 'org_instagram', label: 'Instagram URL' },
]

export default function AdminSettings() {
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    client
      .get('/settings')
      .then((r) => setValues(r.data ?? {}))
      .finally(() => setLoading(false))
  }, [])

  function update(key, value) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await client.put('/settings', { settings: values })
      toast.success('Settings saved.')
    } catch {
      toast.error('Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-[var(--color-ink)]/50">Loading…</p>

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Site Settings</h1>
      <p className="mt-1 text-sm text-[var(--color-ink)]/60">
        This information appears across the public site — home, footer and contact page.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-2xl space-y-5 rounded-2xl border border-[var(--color-ink)]/10 bg-white p-5 sm:p-8"
      >
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium">{field.label}</label>
            {field.textarea ? (
              <textarea
                rows={3}
                value={values[field.key] || ''}
                onChange={(e) => update(field.key, e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
              />
            ) : (
              <input
                value={values[field.key] || ''}
                onChange={(e) => update(field.key, e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
              />
            )}
          </div>
        ))}

        <div className="border-t border-[var(--color-ink)]/10 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-[var(--color-maroon)] px-6 py-2.5 text-sm font-medium text-[var(--color-cream)] disabled:opacity-60 sm:w-auto"
          >
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  )
}