import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import VotingButtons from './VotingButtons'
import Image from 'next/image'

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

// Function to calculate vote percentages and determine consensus
const calculateVotes = (promise: any) => {
  const votes = promise.promise_votes || []
  const total = votes.length
  
  // Always return percentages structure, even when no votes
  const percentages = {
    complete: 0,
    inProgress: 0,
    broken: 0,
    notStarted: 0
  }
  
  if (total === 0) {
    return { 
      total: 0, 
      consensus: 'No votes yet', 
      percentages 
    }
  }

  const counts: Record<string, number> = votes.reduce((acc: Record<string, number>, vote: any) => {
    acc[vote.vote_status] = (acc[vote.vote_status] || 0) + 1
    return acc
  }, {})

  // Calculate percentages
  percentages.complete = Math.round((counts['Complete'] || 0) / total * 100)
  percentages.inProgress = Math.round((counts['In Progress'] || 0) / total * 100)
  percentages.broken = Math.round((counts['Broken'] || 0) / total * 100)
  percentages.notStarted = Math.round((counts['Not Started'] || 0) / total * 100)

  // Determine consensus (highest percentage) - now TypeScript knows counts values are numbers
  const maxVotes = Math.max(...Object.values(counts))
  const consensusStatus = Object.keys(counts).find(key => counts[key] === maxVotes) || 'Unclear'

  return {
    total,
    consensus: consensusStatus,
    percentages
  }
}

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back link */}
        <Link href="/politicians" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Politicians
        </Link>

{/* Politician header */}
<div className="bg-white p-6 rounded-lg shadow mb-8">
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
      <h1 className="text-3xl text-gray-800 font-bold mb-2">{politician.name}</h1>
      <p className="text-xl text-gray-600 mb-2">{politician.position}</p>
      {politician.party && (
        <p className="text-gray-500">{politician.party}</p>
      )}
    </div>
  </div>
</div>

      {/* Update the promises section header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Promises ({promises?.length || 0})</h2>
        <Link 
          href={`/politicians/${id}/add-promise`}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Promise
        </Link>
      </div>

        {/* Promises list */}
        <div className="space-y-4">
          {promises?.map((promise) => {
            const votes = calculateVotes(promise)
            
            return (
              <div key={promise.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg text-gray-800 font-semibold">{promise.title}</h3>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      votes.consensus === 'Complete' ? 'bg-green-100 text-green-800' :
                      votes.consensus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      votes.consensus === 'Broken' ? 'bg-red-100 text-red-800' :
                      votes.consensus === 'Not Started' ? 'bg-gray-100 text-gray-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {votes.consensus}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {votes.total} {votes.total === 1 ? 'vote' : 'votes'}
                    </div>
                  </div>
                </div>
                
                {promise.description && (
                  <p className="text-gray-600 mb-3">{promise.description}</p>
                )}

                {/* Community voting results */}
                {votes.total > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 font-medium mb-2">Community Assessment:</p>
                    <div className="space-y-1">
                      <div className="grid text-gray-700 grid-cols-4 gap-2 text-sm">
                        <span>Complete: {votes.percentages.complete}%</span>
                        <span>In Progress: {votes.percentages.inProgress}%</span>
                        <span>Broken: {votes.percentages.broken}%</span>
                        <span>Not Started: {votes.percentages.notStarted}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="flex h-2 rounded-full overflow-hidden">
                          <div className="bg-green-500" style={{width: `${votes.percentages.complete}%`}}></div>
                          <div className="bg-yellow-500" style={{width: `${votes.percentages.inProgress}%`}}></div>
                          <div className="bg-red-500" style={{width: `${votes.percentages.broken}%`}}></div>
                          <div className="bg-gray-400" style={{width: `${votes.percentages.notStarted}%`}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Voting buttons component */}
                <VotingButtons promiseId={promise.id} />
                
                <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                  {promise.date_made && (
                    <span>Promised: {new Date(promise.date_made).toLocaleDateString()}</span>
                  )}
                  {promise.source_url && (
                    <a 
                      href={promise.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
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