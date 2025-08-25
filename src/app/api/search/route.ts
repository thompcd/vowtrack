import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface PoliticianRow { id: number; name: string; position: string | null; party: string | null; image_url: string | null }
interface PromiseRow { id: number; title: string; description: string | null; politician_id: number; politicians?: PoliticianRow | PoliticianRow[] | null }
interface UnifiedResult {
  type: 'politician' | 'promise'
  id: number
  title: string
  subtitle?: string
  description?: string | null
  image_url?: string | null
  relevance: number
  href: string
}

// Simple relevance scoring helper
function scoreMatch(q: string, text: string | null | undefined) {
  if (!text) return 0
  const lowerText = text.toLowerCase()
  const lowerQ = q.toLowerCase()
  if (lowerText === lowerQ) return 5
  if (lowerText.startsWith(lowerQ)) return 4
  if (lowerText.includes(lowerQ)) return 2
  return 0
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()
  const limitParam = searchParams.get('limit')
  const limit = Math.min(Math.max(parseInt(limitParam || '3', 10) || 3, 1), 20)

  if (!q) {
    return NextResponse.json({ query: q, results: [] })
  }

  // Fetch politicians
  const { data: politicianMatches } = await supabase
    .from('politicians')
    .select('id, name, position, party, image_url')
    .or(`name.ilike.%${q}%,position.ilike.%${q}%`)
    .limit(limit * 2)

  // Fetch promises with joined politician
  const { data: promiseMatches } = await supabase
    .from('promises')
    .select('id, title, description, politician_id, politicians:politician_id ( id, name, position, party, image_url )')
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    .limit(limit * 2)
  const results: UnifiedResult[] = []

  const polArray = (politicianMatches || []) as PoliticianRow[]
  polArray.forEach((p: PoliticianRow) => {
    const relevance = Math.max(
      scoreMatch(q, p.name),
      scoreMatch(q, p.position)
    )
    results.push({
      type: 'politician',
      id: p.id,
      title: p.name,
      subtitle: p.position || p.party || '',
      image_url: p.image_url,
      relevance,
      href: `/politicians/${p.id}`
    })
  })

  const promiseArray = (promiseMatches || []) as PromiseRow[]
  promiseArray.forEach((pr: PromiseRow) => {
    let pol: PoliticianRow | null = null
    if (pr.politicians) {
      pol = Array.isArray(pr.politicians) ? pr.politicians[0] ?? null : pr.politicians
    }
    const relevance = Math.max(
      scoreMatch(q, pr.title),
      scoreMatch(q, pr.description)
    )
    results.push({
      type: 'promise',
      id: pr.id,
      title: pr.title,
      subtitle: pol?.name || '',
      description: pr.description,
      image_url: pol?.image_url,
      relevance,
      href: `/politicians/${pr.politician_id}`
    })
  })

  results.sort((a, b) => b.relevance - a.relevance || a.title.localeCompare(b.title))

  return NextResponse.json({ query: q, results: results.slice(0, limit) })
}
