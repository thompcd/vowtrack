import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { calculatePoliticianScore } from '@/lib/scoring'

interface RecentPromiseRow {
  id: number
  title: string
  date_made: string | null
  politician_id: number
  // Supabase may return an array for the joined relation alias depending on schema
  politicians?: { id: number; name: string; image_url: string | null } | { id: number; name: string; image_url: string | null }[] | null
}

interface NormalizedPromise {
  id: number
  title: string
  date_made: string | null
  politician: { id: number; name: string; image_url: string | null } | null
}

interface PopularPolitician {
  id: number
  name: string
  position: string | null
  party: string | null
  image_url: string | null
  overall_score: number
  grade: string
  total_votes: number
}

interface VoteRow { vote_status: string }
interface PromiseWithVotes { id: number; promise_votes: VoteRow[] | null }
interface PoliticianWithPromises {
  id: number
  name: string
  position: string | null
  party: string | null
  image_url: string | null
  promises: PromiseWithVotes[] | null
}

export default async function Home() {
  // Fetch recent promises and politicians concurrently
  const [recentPromiseResp, politiciansResp] = await Promise.all([
    supabase
      .from('promises')
      .select(`id, title, date_made, politician_id, politicians:politician_id ( id, name, image_url )`)
      .order('date_made', { ascending: false })
      .limit(10),
    supabase
      .from('politicians')
      .select(`id, name, position, party, image_url, promises(id, promise_votes(vote_status))`)
      .limit(30)
  ])

  const recentPromiseRows = recentPromiseResp.data
  const politicianRows = politiciansResp.data as PoliticianWithPromises[] | null

  const recentPromises: NormalizedPromise[] = (recentPromiseRows as RecentPromiseRow[] | null)?.map(r => {
    let politician: NormalizedPromise['politician'] = null
    if (r.politicians) {
      if (Array.isArray(r.politicians)) {
        politician = r.politicians[0] ?? null
      } else {
        politician = r.politicians
      }
    }
    return {
      id: r.id,
      title: r.title,
      date_made: r.date_made,
      politician
    }
  }) ?? []

  // Determine popular politicians by score & vote volume
  const popularPoliticians: PopularPolitician[] = (politicianRows || []).map(p => {
    const score = calculatePoliticianScore(
      (p.promises || []).map(pr => ({
        id: pr.id,
        promise_votes: pr.promise_votes || []
      }))
    )
    return {
      id: p.id,
      name: p.name,
      position: p.position,
      party: p.party,
      image_url: p.image_url,
      overall_score: score.overall_score,
      grade: score.grade,
      total_votes: score.total_votes
    }
  })
  .sort((a, b) => b.overall_score - a.overall_score || b.total_votes - a.total_votes || a.name.localeCompare(b.name))
  .slice(0, 5)

  return (
    <div className="min-h-screen bg-page py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10 flex items-center space-x-4">
          <Image
            src="/images/logo.png"
            alt="VowTrack Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <h1 className="text-4xl font-bold text-primary tracking-tight">VowTrack</h1>
            <p className="text-secondary text-lg">Tracking political promises and accountability</p>
          </div>
        </div>

  <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 items-start">
          {/* Left: Purpose & How It Works */}
          <section className="space-y-6">
            <div className="bg-surface border border-default rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-primary mb-4">Why VowTrack?</h2>
              <p className="text-secondary leading-relaxed mb-4">
                Democracies work best when citizens can clearly see what was promised—and what was delivered. VowTrack lets the community log political promises, vote on their progress, and surface accountability metrics.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-secondary text-sm">
                <li><span className="text-primary font-medium">Add Politicians:</span> Create profiles for public officials.</li>
                <li><span className="text-primary font-medium">Log Promises:</span> Add verifiable commitments with sources.</li>
                <li><span className="text-primary font-medium">Vote Status:</span> Community evaluates progress (Complete, In Progress, Broken, Not Started).</li>
                <li><span className="text-primary font-medium">Score & Grade:</span> Aggregated votes produce a transparency score and letter grade.</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/politicians" className="bg-brand-primary text-white px-5 py-2.5 rounded hover:bg-brand-primary-hover text-sm font-medium transition-colors">Browse Politicians</Link>
                <Link href="/politicians/add" className="bg-surface border border-default px-5 py-2.5 rounded text-sm font-medium text-primary hover:bg-neutral-50 transition-colors">Add Politician</Link>
              </div>
            </div>

            <div className="bg-surface border border-default rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3">How Votes Become Scores</h3>
              <p className="text-secondary text-sm leading-relaxed mb-3">
                Each promise accumulates community votes. Completed promises score highest, while broken ones lower the overall grade. Weighting favors promises with more votes, and a consensus metric shows how aligned the community is.
              </p>
              <p className="text-muted text-xs">Scoring logic can evolve—feedback is welcome.</p>
            </div>
          </section>

          {/* Middle: Recent Promises Feed */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-primary">Recent Promises</h2>
                <Link href="/search" className="text-brand-primary text-sm hover:text-brand-primary-hover font-medium">Search →</Link>
              </div>
              <div className="space-y-4">
                {recentPromises.length > 0 ? (
                  recentPromises.map((p) => (
                    <div key={p.id} className="bg-surface border border-default rounded-lg p-5 shadow-sm hover:shadow transition-shadow">
                      <div className="flex items-start gap-4">
                        {p.politician?.image_url && (
                          <Image
                            src={p.politician.image_url}
                            alt={p.politician.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-primary font-medium text-sm mb-1 line-clamp-2">{p.title}</h3>
                          {p.politician && (
                            <Link href={`/politicians/${p.politician.id}`} className="text-brand-primary text-xs hover:text-brand-primary-hover font-medium inline-block">{p.politician.name}</Link>
                          )}
                          <div className="text-muted text-[11px] mt-1">
                            {p.date_made ? new Date(p.date_made).toLocaleDateString() : 'Date unknown'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted text-sm border border-dashed border-default rounded-lg p-6 text-center">
                    No promises added yet.
                  </div>
                )}
              </div>
              <div className="bg-surface border border-default rounded-lg p-4 text-xs text-muted">
                Want to improve this feed? <Link href="/request-feature" className="text-brand-primary hover:text-brand-primary-hover font-medium">Request a feature</Link>
              </div>
            </section>
          {/* Right: Popular Politicians */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-primary">Notable Politicians</h2>
              <Link href="/politicians" className="text-brand-primary text-sm hover:text-brand-primary-hover font-medium">All →</Link>
            </div>
            <div className="space-y-4">
              {popularPoliticians.length > 0 ? popularPoliticians.map(p => (
                <Link key={p.id} href={`/politicians/${p.id}`} className="block bg-surface border border-default rounded-lg p-4 hover:shadow transition-shadow">
                  <div className="flex items-center gap-4">
                    {p.image_url && (
                      <Image src={p.image_url} alt={p.name} width={56} height={56} className="rounded-full object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-primary font-medium truncate">{p.name}</p>
                      {p.position && <p className="text-secondary text-xs truncate">{p.position}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-primary text-white">{p.overall_score}</span>
                        <span className="text-xs text-muted">{p.grade}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="text-muted text-sm border border-dashed border-default rounded-lg p-6 text-center">No data yet.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}