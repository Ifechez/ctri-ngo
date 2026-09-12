export default function RanksDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden="true">
      <span className="h-px w-8 bg-[var(--color-gold)]/60" />
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]"
          style={{ opacity: 0.4 + i * 0.15 }}
        />
      ))}
      <span className="h-px w-8 bg-[var(--color-gold)]/60" />
    </div>
  )
}
