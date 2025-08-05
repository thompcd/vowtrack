import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { calculatePoliticianScore } from '@/lib/scoring'
import ScoreCard from '@/components/ScoreCard'

export default async function Politicians() {
  // Fetch politicians with their promises and votes
  const { data: politicians } = await supabase
    .from('politicians')
    .select(`
      *,
      promises(
        id,
        promise_votes(vote_status)
      )
    `)
    .order('name')

  // Calculate scores for each politician
  const politiciansWithScores = politicians?.map(politician => ({
    ...politician,
    score: calculatePoliticianScore(politician.promises || [])
  })) || []

  // Sort by score (highest first)
  politiciansWithScores.sort((a, b) => b.score.overall_score - a.score.overall_score)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Politicians</h1>
          <Link 
            href="/politicians/add"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Politician
          </Link>
        </div>
        
        <div className="grid gap-6">
          {politiciansWithScores.map((politician) => (
            <div key={politician.id} className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Politician Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-4">
                    {politician.image_url && (
                      <Image
                        src={politician.image_url}
                        alt={politician.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">{politician.name}</h2>
                      <p className="text-gray-800 font-medium">{politician.position}</p>
                      {politician.party && (
                        <p className="text-gray-700">{politician.party}</p>
                      )}
                      <Link 
                        href={`/politicians/${politician.id}`}
                        className="text-blue-600 hover:underline mt-2 inline-block font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Score Card */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-xs">
                    <ScoreCard score={politician.score} size="small" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {politiciansWithScores.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No politicians found. Be the first to add one!
          </div>
        )}
      </div>
    </div>
  )
}