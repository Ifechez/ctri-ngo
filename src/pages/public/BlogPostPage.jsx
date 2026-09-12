import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import client from '../../api/client'
import Reveal from '../../components/public/Reveal'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setPost(null)
    setNotFound(false)
    client
      .get(`/blog-posts/${slug}`)
      .then((r) => setPost(r.data))
      .catch(() => setNotFound(true))
  }, [slug])

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold">Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-[var(--color-maroon)]">Back to blog</Link>
      </div>
    )
  }

  if (!post) return <div className="mx-auto max-w-2xl px-5 py-32 text-center text-[var(--color-ink)]/50">Loading…</div>

  return (
    <article className="mx-auto max-w-3xl px-5 py-20">
      <Reveal>
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-maroon)]">
          <ArrowLeft size={14} /> Back to blog
        </Link>
        <p className="mt-6 text-xs font-medium uppercase tracking-wide text-[var(--color-crimson)]">
          {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
          {post.author_name ? ` · ${post.author_name}` : ''}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{post.title}</h1>

        {post.cover_image_url && (
          <img src={post.cover_image_url} alt={post.title} className="mt-8 w-full rounded-2xl object-cover" />
        )}

        <div className="prose prose-lg mt-8 max-w-none whitespace-pre-wrap leading-relaxed text-[var(--color-ink)]/80">
          {post.content}
        </div>
      </Reveal>
    </article>
  )
}
