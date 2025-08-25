import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

interface PoliticianRow { id: number; name: string; position: string | null; party: string | null; image_url: string | null }
interface PromiseRow { id: number; title: string; description: string | null; politician_id: number; politicians?: { id: number; name: string; image_url: string | null } | { id: number; name: string; image_url: string | null }[] | null }
interface SearchItem {
  type: 'politician' | 'promise'
  id: number
  title: string
  subtitle: string
  description?: string | null
  image_url?: string | null
  relevance: number
  href: string
}

export const metadata = { title: 'Search - VowTrack' }

function score(q: string, text: string | null | undefined) {
  if (!text) return 0
  const t = text.toLowerCase(); const qq = q.toLowerCase()
  if (t === qq) return 5
  if (t.startsWith(qq)) return 4
  if (t.includes(qq)) return 2
  return 0
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolved = await searchParams
  const rawQ = resolved.q
  const rawPage = resolved.page
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ || '').trim()
  const pageParam = Array.isArray(rawPage) ? rawPage[0] : rawPage
  const pageSize = 20
  const page = Math.max(parseInt(pageParam || '1', 10) || 1, 1)

  const items: SearchItem[] = []
  if (q) {
    const [{ data: pols }, { data: promises }] = await Promise.all([
      supabase.from('politicians').select('id, name, position, party, image_url').or(`name.ilike.%${q}%,position.ilike.%${q}%`),
      supabase.from('promises').select('id, title, description, politician_id, politicians:politician_id ( id, name, image_url )').or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    ])

    ;((pols || []) as PoliticianRow[]).forEach(p => {
      items.push({
        type: 'politician',
        id: p.id,
        title: p.name,
        subtitle: p.position || p.party || '',
        image_url: p.image_url,
        relevance: Math.max(score(q, p.name), score(q, p.position)),
        href: `/politicians/${p.id}`
      })
    })

    ;((promises || []) as PromiseRow[]).forEach(pr => {
      let pol: { id: number; name: string; image_url: string | null } | null = null
      const rel = pr.politicians
      if (rel) pol = Array.isArray(rel) ? rel[0] ?? null : rel
      items.push({
        type: 'promise',
        id: pr.id,
        title: pr.title,
        subtitle: pol?.name || '',
        description: pr.description,
        image_url: pol?.image_url,
        relevance: Math.max(score(q, pr.title), score(q, pr.description)),
        href: `/politicians/${pr.politician_id}`
      })
    })

    items.sort((a, b) => b.relevance - a.relevance || a.title.localeCompare(b.title))
  }

  const total = items.length
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)
  const paged = items.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="min-h-screen bg-page py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-primary mb-6">Search Results</h1>
        <form action="/search" method="get" className="mb-8">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search again..."
            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-default bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </form>
        {!q && <p className="text-secondary">Enter a term above to search politicians and promises.</p>}
        {q && total === 0 && <p className="text-secondary">No matches found for <span className="font-semibold text-primary">{q}</span>.</p>}
        {q && total > 0 && (
          <>
            <p className="text-sm text-muted mb-4">Showing {paged.length} of {total} results for <span className="text-primary font-medium">{q}</span></p>
            <ul className="space-y-4">
              {paged.map(item => (
                <li key={`${item.type}-${item.id}`} className="bg-surface border border-default rounded-lg p-5 flex gap-4 hover:shadow-sm transition-shadow">
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.title} width={56} height={56} className="rounded-full object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={item.href} className="text-primary font-medium hover:text-brand-primary transition-colors">{item.title}</Link>
                    {item.subtitle && <p className="text-secondary text-xs mt-0.5">{item.subtitle}</p>}
                    {item.type === 'promise' && item.description && (
                      <p className="text-muted text-xs mt-2 line-clamp-3">{item.description}</p>
                    )}
                    <div className="mt-2 text-[10px] uppercase tracking-wide text-muted">{item.type}</div>
                  </div>
                </li>
              ))}
            </ul>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1
                  const active = pageNum === page
                  const params = new URLSearchParams({ q, page: String(pageNum) })
                  return (
                    <Link
                      key={pageNum}
                      href={`/search?${params.toString()}`}
                      className={`px-3 py-1 rounded text-sm border border-default ${active ? 'bg-brand-primary text-white' : 'bg-surface text-secondary hover:bg-neutral-50'}`}
                    >
                      {pageNum}
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
