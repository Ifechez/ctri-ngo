import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-6xl font-semibold text-[var(--color-maroon)]">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-[var(--color-ink)]/60">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="mt-6 rounded-full bg-[var(--color-maroon)] px-6 py-2.5 text-sm font-medium text-[var(--color-cream)]">
        Back home
      </Link>
    </div>
  )
}
