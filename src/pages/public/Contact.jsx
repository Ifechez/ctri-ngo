import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import client from '../../api/client'
import { useSettings } from '../../context/SettingsContext'
import Reveal from '../../components/public/Reveal'

export default function Contact() {
  const { settings } = useSettings()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})
    try {
      const res = await client.post('/contact', form)
      toast.success(res.data.message || 'Message sent!')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <Reveal className="text-center">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Get in Touch</h1>
        <p className="mx-auto mt-3 max-w-lg text-[var(--color-ink)]/60">
          Whether you want to partner, volunteer or ask a question — we would love to hear from you.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="space-y-6 rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-cream-dim)] p-8">
            {settings.org_email && (
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 text-[var(--color-maroon)]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]/50">Email</p>
                  <a href={`mailto:${settings.org_email}`} className="font-medium">{settings.org_email}</a>
                </div>
              </div>
            )}
            {settings.org_phone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 text-[var(--color-maroon)]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]/50">Phone</p>
                  <a href={`tel:${settings.org_phone}`} className="font-medium">{settings.org_phone}</a>
                  {settings.org_phone_alt && <p className="font-medium">{settings.org_phone_alt}</p>}
                </div>
              </div>
            )}
            {settings.org_address && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 text-[var(--color-maroon)]" size={20} />
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]/50">Address</p>
                  <p className="font-medium">{settings.org_address}</p>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[var(--color-ink)]/10 bg-white p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
                />
                {errors.name && <p className="mt-1 text-xs text-[var(--color-crimson)]">{errors.name[0]}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
                />
                {errors.email && <p className="mt-1 text-xs text-[var(--color-crimson)]">{errors.email[0]}</p>}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <input
                value={form.subject}
                onChange={(e) => update('subject', e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-ink)]/15 px-3 py-2.5 focus:border-[var(--color-maroon)] focus:outline-none"
              />
              {errors.message && <p className="mt-1 text-xs text-[var(--color-crimson)]">{errors.message[0]}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-full bg-[var(--color-maroon)] px-6 py-3 text-sm font-medium text-[var(--color-cream)] transition-transform hover:scale-105 disabled:opacity-60"
            >
              <Send size={16} /> {submitting ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  )
}
