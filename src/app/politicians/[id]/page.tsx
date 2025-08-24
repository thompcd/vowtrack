import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import VotingButtons from './VotingButtons'
import Image from 'next/image'
import { calculatePoliticianScore } from '@/lib/scoring'
import ScoreCard from '@/components/ScoreCard'

export default async function PoliticianPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Fetch politician
  const { data: politician } = await supabase
    .from('politicians')
    .select('*')
    .eq('id', id)
    .single()

    // Fetch promises with recent vote counts (last 3 months)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  // Fetch promises with vote counts (including promises with no votes)
  const { data: promises } = await supabase
    .from('promises')
    .select(`
      *,
      promise_votes(vote_status)
    `)
    .eq('politician_id', id)
    .order('date_made', { ascending: false })

    console.log('Promises with recent votes:', promises)

  const score = calculatePoliticianScore(promises || [])

// Function to calculate vote percentages and determine consensus
type VoteStatus = 'Complete' | 'In Progress' | 'Broken' | 'Not Started'
type PromiseVote = { vote_status: VoteStatus }
type PromiseWithVotes = {
  id: string
  title: string
  description?: string
  date_made?: string
  source_url?: string
  promise_votes?: PromiseVote[]
}

const calculateVotes = (promise: PromiseWithVotes) => {
  const votes = promise.promise_votes ?? []
  const total = votes.length

  const percentages = {
    complete: 0,
    inProgress: 0,
    broken: 0,
    notStarted: 0,
  }

  if (total === 0) {
    return {
      total: 0,
      consensus: 'No votes yet',
      percentages,
    }
  }

  const counts: Record<VoteStatus, number> = {
    'Complete': 0,
    'In Progress': 0,
    'Broken': 0,
    'Not Started': 0,
  }

  for (const vote of votes) {
    counts[vote.vote_status]++
  }

  percentages.complete = Math.round((counts['Complete'] / total) * 100)
  percentages.inProgress = Math.round((counts['In Progress'] / total) * 100)
  percentages.broken = Math.round((counts['Broken'] / total) * 100)
  percentages.notStarted = Math.round((counts['Not Started'] / total) * 100)

  const maxVotes = Math.max(...Object.values(counts))
  const consensusStatus =
    (Object.keys(counts) as VoteStatus[]).find(
      (key) => counts[key] === maxVotes && counts[key] > 0
    ) || 'Unclear'

  return {
    total,
    consensus: consensusStatus,
    percentages,
  }
}

  return (
  <div className="min-h-screen bg-page py-12">
    <div className="max-w-4xl mx-auto px-4">
      {/* Back link */}
      <Link href="/politicians" className="text-brand-primary hover:text-brand-primary-hover mb-6 inline-block transition-colors">
        ← Back to Politicians
      </Link>

      {/* Politician header */}
      <div className="bg-surface p-6 rounded-lg shadow mb-8 border border-default">
        <div className="flex items-center space-x-6">
          {politician.image_url && (
            <Image
              src={politician.image_url}
              alt={politician.name}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl text-primary font-bold mb-2">{politician.name}</h1>
            <p className="text-xl text-secondary mb-2">{politician.position}</p>
            {politician.party && (
              <p className="text-muted">{politician.party}</p>
            )}
          </div>
        </div>
      </div>

      {/* Score Card */}
      <div className="mb-8">
        <ScoreCard score={score} size="large" />
      </div>

      {/* Promises section header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Promises ({promises?.length || 0})</h2>
        <Link 
          href={`/politicians/${id}/add-promise`}
          className="bg-status-complete text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          + Add Promise
        </Link>
      </div>

      {/* Promises list */}
      <div className="space-y-4">
        {promises?.map((promise) => {
          const votes = calculateVotes(promise)
          
          return (
            <div key={promise.id} className="bg-surface p-6 rounded-lg shadow border border-default">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg text-primary font-semibold">{promise.title}</h3>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    votes.consensus === 'Complete' ? 'bg-status-complete text-status-complete' :
                    votes.consensus === 'In Progress' ? 'bg-status-progress text-status-progress' :
                    votes.consensus === 'Broken' ? 'bg-status-broken text-status-broken' :
                    votes.consensus === 'Not Started' ? 'bg-status-not-started text-status-not-started' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {votes.consensus}
                  </span>
                  <div className="text-xs text-muted mt-1">
                    {votes.total} {votes.total === 1 ? 'vote' : 'votes'}
                  </div>
                </div>
              </div>
              
              {promise.description && (
                <p className="text-secondary mb-3">{promise.description}</p>
              )}

              {/* Community voting results */}
              {votes.total > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-primary font-medium mb-2">Community Assessment:</p>
                  <div className="space-y-1">
                    <div className="grid text-secondary grid-cols-4 gap-2 text-sm">
                      <span>Complete: {votes.percentages.complete}%</span>
                      <span>In Progress: {votes.percentages.inProgress}%</span>
                      <span>Broken: {votes.percentages.broken}%</span>
                      <span>Not Started: {votes.percentages.notStarted}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div className="bg-status-complete" style={{width: `${votes.percentages.complete}%`}}></div>
                        <div className="bg-status-progress" style={{width: `${votes.percentages.inProgress}%`}}></div>
                        <div className="bg-status-broken" style={{width: `${votes.percentages.broken}%`}}></div>
                        <div className="bg-neutral-400" style={{width: `${votes.percentages.notStarted}%`}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Voting buttons component */}
              <VotingButtons promiseId={promise.id} />
              
              <div className="flex justify-between items-center text-sm text-muted mt-4">
                {promise.date_made && (
                  <span>Promised: {new Date(promise.date_made).toLocaleDateString()}</span>
                )}
                {promise.source_url && (
                  <a 
                    href={promise.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:text-brand-primary-hover transition-colors"
                  >
                    View Source →
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)
}