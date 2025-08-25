'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface SearchResult {
  type: 'politician' | 'promise'
  id: number
  title: string
  subtitle?: string
  description?: string
  image_url?: string | null
  href: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const timeoutRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=3`)
        const data = await res.json()
        setResults(data.results || [])
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [query])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="relative">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search politicians & promises..."
          className="w-full pl-4 pr-10 py-2 rounded-lg border border-default bg-surface text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-primary text-sm font-medium">Go</button>
      </form>
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-surface border border-default rounded-lg shadow-lg overflow-hidden">
          <ul className="divide-y divide-default">
            {results.map(r => (
              <li key={`${r.type}-${r.id}`}>
                <Link
                  href={r.href}
                  className="flex items-start gap-3 p-3 hover:bg-neutral-50 focus:bg-neutral-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {r.image_url && (
                    <Image src={r.image_url} alt={r.title} width={40} height={40} className="rounded-full object-cover" />
                  )}
                  <div className="min-w-0">
                    <p className="text-primary text-sm font-medium truncate">{r.title}</p>
                    {r.subtitle && <p className="text-secondary text-xs truncate">{r.subtitle}</p>}
                    {r.type === 'promise' && r.description && (
                      <p className="text-muted text-[11px] line-clamp-2">{r.description}</p>
                    )}
                  </div>
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-muted">{r.type}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="p-2 bg-neutral-50 text-center">
            <button
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`)
                setOpen(false)
              }}
              className="text-brand-primary hover:text-brand-primary-hover text-xs font-medium"
            >
              Show all results →
            </button>
          </div>
        </div>
      )}
      {open && !loading && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-surface border border-default rounded-lg shadow p-4 text-center text-xs text-muted">No results</div>
      )}
      {open && loading && (
        <div className="absolute z-50 mt-2 w-full bg-surface border border-default rounded-lg shadow p-4 text-center text-xs text-muted">Searching...</div>
      )}
    </div>
  )
}
