import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function PoliticianPage({ params }: { params: { id: string } }) {
  // Fetch politician
  const { data: politician } = await supabase
    .from('politicians')
    .select('*')
    .eq('id', params.id)
    .single()

  // Fetch their promises
  const { data: promises } = await supabase
    .from('promises')
    .select('*')
    .eq('politician_id', params.id)
    .order('date_made', { ascending: false })

  if (!politician) {
    return <div>Politician not found</div>
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
          <h1 className="text-3xl font-bold mb-2">{politician.name}</h1>
          <p className="text-xl text-gray-600 mb-2">{politician.position}</p>
          {politician.party && (
            <p className="text-gray-500">{politician.party}</p>
          )}
        </div>

        {/* Promises section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Promises ({promises?.length || 0})</h2>
        </div>

        {/* Promises list */}
        <div className="space-y-4">
          {promises?.map((promise) => (
            <div key={promise.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{promise.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  promise.status === 'Complete' ? 'bg-green-100 text-green-800' :
                  promise.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  promise.status === 'Broken' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {promise.status}
                </span>
              </div>
              
              {promise.description && (
                <p className="text-gray-600 mb-3">{promise.description}</p>
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-500">
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
          ))}
        </div>

        {promises?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No promises tracked yet for {politician.name}
          </div>
        )}
      </div>
    </div>
  )
}